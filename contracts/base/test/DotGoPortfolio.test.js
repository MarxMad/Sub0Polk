const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("DotGoPortfolio", function () {
  let portfolio;
  let owner;
  let student;
  let reviewer;
  let treasury;
  let unlockPrice;

  beforeEach(async function () {
    [owner, student, reviewer, treasury] = await ethers.getSigners();

    const DotGoPortfolio = await ethers.getContractFactory("DotGoPortfolio");
    portfolio = await DotGoPortfolio.deploy(treasury.address);
    await portfolio.waitForDeployment();

    unlockPrice = await portfolio.getUnlockPrice();
  });

  describe("Deployment", function () {
    it("Should set the correct treasury address", async function () {
      expect(await portfolio.platformTreasury()).to.equal(treasury.address);
    });

    it("Should set the correct unlock price", async function () {
      expect(await portfolio.getUnlockPrice()).to.equal(ethers.parseEther("0.001"));
    });

    it("Should start with zero projects", async function () {
      expect(await portfolio.getTotalProjects()).to.equal(0);
    });
  });

  describe("Project Creation", function () {
    it("Should create a project successfully", async function () {
      const tx = await portfolio.connect(student).createProject(
        "Test Portfolio",
        "A test project",
        "https://github.com/test",
        "https://demo.test",
        ["Solidity", "JavaScript"]
      );

      await expect(tx)
        .to.emit(portfolio, "ProjectCreated")
        .withArgs(0, student.address, "Test Portfolio");

      const project = await portfolio.getProject(0);
      expect(project.title).to.equal("Test Portfolio");
      expect(project.student).to.equal(student.address);
      expect(project.unlockCount).to.equal(0);
    });

    it("Should track student projects", async function () {
      await portfolio.connect(student).createProject(
        "Project 1",
        "Description 1",
        "https://github.com/1",
        "https://demo1.com",
        ["Rust"]
      );

      await portfolio.connect(student).createProject(
        "Project 2",
        "Description 2",
        "https://github.com/2",
        "https://demo2.com",
        ["Solidity"]
      );

      const projects = await portfolio.getStudentProjects(student.address);
      expect(projects.length).to.equal(2);
      expect(projects[0]).to.equal(0);
      expect(projects[1]).to.equal(1);
    });
  });

  describe("Project Unlocking", function () {
    beforeEach(async function () {
      await portfolio.connect(student).createProject(
        "Test Portfolio",
        "A test project",
        "https://github.com/test",
        "https://demo.test",
        ["Solidity"]
      );
    });

    it("Should unlock project with correct payment", async function () {
      const studentBalanceBefore = await ethers.provider.getBalance(student.address);
      const treasuryBalanceBefore = await ethers.provider.getBalance(treasury.address);

      await expect(
        portfolio.connect(reviewer).unlockProject(0, { value: unlockPrice })
      ).to.emit(portfolio, "ProjectUnlocked");

      expect(await portfolio.isUnlocked(0, reviewer.address)).to.be.true;

      const project = await portfolio.getProject(0);
      expect(project.unlockCount).to.equal(1);

      // Check balances increased
      const studentBalanceAfter = await ethers.provider.getBalance(student.address);
      const treasuryBalanceAfter = await ethers.provider.getBalance(treasury.address);

      expect(studentBalanceAfter).to.be.gt(studentBalanceBefore);
      expect(treasuryBalanceAfter).to.be.gt(treasuryBalanceBefore);
    });

    it("Should revert if payment is insufficient", async function () {
      await expect(
        portfolio.connect(reviewer).unlockProject(0, { value: ethers.parseEther("0.0001") })
      ).to.be.revertedWithCustomError(portfolio, "InsufficientPayment");
    });

    it("Should revert if already unlocked", async function () {
      await portfolio.connect(reviewer).unlockProject(0, { value: unlockPrice });

      await expect(
        portfolio.connect(reviewer).unlockProject(0, { value: unlockPrice })
      ).to.be.revertedWithCustomError(portfolio, "AlreadyUnlocked");
    });

    it("Should revert if student tries to unlock own project", async function () {
      await expect(
        portfolio.connect(student).unlockProject(0, { value: unlockPrice })
      ).to.be.revertedWithCustomError(portfolio, "CannotReviewOwnProject");
    });

    it("Should revert if project does not exist", async function () {
      await expect(
        portfolio.connect(reviewer).unlockProject(999, { value: unlockPrice })
      ).to.be.revertedWithCustomError(portfolio, "ProjectNotFound");
    });
  });

  describe("Review Submission", function () {
    beforeEach(async function () {
      await portfolio.connect(student).createProject(
        "Test Portfolio",
        "A test project",
        "https://github.com/test",
        "https://demo.test",
        ["Solidity"]
      );

      await portfolio.connect(reviewer).unlockProject(0, { value: unlockPrice });
    });

    it("Should submit review successfully", async function () {
      await expect(
        portfolio.connect(reviewer).submitReview(0, 5, "Excellent work!")
      ).to.emit(portfolio, "ReviewSubmitted");

      const reviews = await portfolio.getReviews(0);
      expect(reviews.length).to.equal(1);
      expect(reviews[0].rating).to.equal(5);
      expect(reviews[0].comment).to.equal("Excellent work!");
      expect(reviews[0].reviewer).to.equal(reviewer.address);
    });

    it("Should update average rating correctly", async function () {
      await portfolio.connect(reviewer).submitReview(0, 5, "Great!");

      const project = await portfolio.getProject(0);
      expect(project.avgRating).to.equal(5);
    });

    it("Should revert if project not unlocked", async function () {
      const [, , , newReviewer] = await ethers.getSigners();

      await expect(
        portfolio.connect(newReviewer).submitReview(0, 5, "Comment")
      ).to.be.revertedWithCustomError(portfolio, "NotUnlocked");
    });

    it("Should revert if rating is invalid", async function () {
      await expect(
        portfolio.connect(reviewer).submitReview(0, 0, "Bad rating")
      ).to.be.revertedWithCustomError(portfolio, "InvalidRating");

      await expect(
        portfolio.connect(reviewer).submitReview(0, 6, "Bad rating")
      ).to.be.revertedWithCustomError(portfolio, "InvalidRating");
    });
  });

  describe("Admin Functions", function () {
    it("Should update pricing", async function () {
      const newUnlockPrice = ethers.parseEther("0.002");
      const newStudentShare = ethers.parseEther("0.0016");
      const newPlatformShare = ethers.parseEther("0.0004");

      await expect(
        portfolio.connect(owner).updatePricing(newUnlockPrice, newStudentShare, newPlatformShare)
      ).to.emit(portfolio, "PricingUpdated");

      expect(await portfolio.unlockPrice()).to.equal(newUnlockPrice);
      expect(await portfolio.studentShare()).to.equal(newStudentShare);
      expect(await portfolio.platformShare()).to.equal(newPlatformShare);
    });

    it("Should revert if pricing is invalid", async function () {
      await expect(
        portfolio.connect(owner).updatePricing(
          ethers.parseEther("0.001"),
          ethers.parseEther("0.0005"),
          ethers.parseEther("0.0006") // Sum doesn't match unlock price
        )
      ).to.be.revertedWithCustomError(portfolio, "InvalidPricing");
    });

    it("Should update treasury address", async function () {
      const [, , , , newTreasury] = await ethers.getSigners();

      await portfolio.connect(owner).updateTreasury(newTreasury.address);
      expect(await portfolio.platformTreasury()).to.equal(newTreasury.address);
    });

    it("Should revert if non-owner tries admin functions", async function () {
      await expect(
        portfolio.connect(student).updateTreasury(student.address)
      ).to.be.reverted;

      await expect(
        portfolio.connect(student).updatePricing(
          ethers.parseEther("0.001"),
          ethers.parseEther("0.0008"),
          ethers.parseEther("0.0002")
        )
      ).to.be.reverted;
    });
  });
});
