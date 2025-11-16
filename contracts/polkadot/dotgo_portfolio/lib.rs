#![cfg_attr(not(feature = "std"), no_std, no_main)]

#[ink::contract(env = ink::env::DefaultEnvironment)]
mod dotgo_portfolio {
    use ink::prelude::string::String;
    use ink::prelude::vec::Vec;
    use ink::storage::Mapping;

    // ==================== DATA STRUCTURES ====================

    #[derive(Debug, PartialEq, Eq)]
    #[ink::scale_derive(Encode, Decode, TypeInfo)]
    #[cfg_attr(feature = "std", derive(ink::storage::traits::StorageLayout))]
    pub struct Project {
        pub id: u64,
        pub student: AccountId,
        pub title: String,
        pub description: String,
        pub github_url: String,
        pub demo_url: String,
        pub skills: Vec<String>,
        pub created_at: Timestamp,
        pub unlock_count: u32,
        pub avg_rating: u8,
    }

    #[derive(Debug, PartialEq, Eq)]
    #[ink::scale_derive(Encode, Decode, TypeInfo)]
    #[cfg_attr(feature = "std", derive(ink::storage::traits::StorageLayout))]
    pub struct Review {
        pub reviewer: AccountId,
        pub rating: u8,
        pub comment: String,
        pub timestamp: Timestamp,
    }

    // ==================== EVENTS ====================

    #[ink(event)]
    pub struct ProjectCreated {
        #[ink(topic)]
        project_id: u64,
        #[ink(topic)]
        student: AccountId,
        title: String,
    }

    #[ink(event)]
    pub struct ProjectUnlocked {
        #[ink(topic)]
        project_id: u64,
        #[ink(topic)]
        reviewer: AccountId,
        amount_paid: Balance,
    }

    #[ink(event)]
    pub struct ReviewSubmitted {
        #[ink(topic)]
        project_id: u64,
        #[ink(topic)]
        reviewer: AccountId,
        rating: u8,
    }

    // ==================== STORAGE ====================

    #[ink(storage)]
    pub struct DotgoPortfolio {
        next_project_id: u64,
        projects: Mapping<u64, Project>,
        student_projects: Mapping<AccountId, Vec<u64>>,
        unlocked: Mapping<(u64, AccountId), bool>,
        reviews: Mapping<u64, Vec<Review>>,
        unlock_price: Balance,
        student_share: Balance,
        platform_share: Balance,
        platform_treasury: AccountId,
    }

    // ==================== ERRORS ====================

    #[derive(Debug, PartialEq, Eq)]
    #[ink::scale_derive(Encode, Decode, TypeInfo)]
    pub enum Error {
        ProjectNotFound,
        NotUnlocked,
        AlreadyUnlocked,
        InsufficientPayment,
        CannotReviewOwnProject,
        InvalidRating,
        TransferFailed,
    }

    pub type Result<T> = core::result::Result<T, Error>;

    // ==================== IMPLEMENTATION ====================

    impl DotgoPortfolio {
        #[ink(constructor)]
        pub fn new(platform_treasury: AccountId) -> Self {
            Self {
                next_project_id: 0,
                projects: Mapping::default(),
                student_projects: Mapping::default(),
                unlocked: Mapping::default(),
                reviews: Mapping::default(),
                unlock_price: 3_000_000_000_000, // 3 DOT
                student_share: 2_500_000_000_000, // 2.5 DOT
                platform_share: 500_000_000_000,   // 0.5 DOT
                platform_treasury,
            }
        }

        #[ink(message)]
        pub fn create_project(
            &mut self,
            title: String,
            description: String,
            github_url: String,
            demo_url: String,
            skills: Vec<String>,
        ) -> u64 {
            let project_id = self.next_project_id;
            let student = self.env().caller();

            let project = Project {
                id: project_id,
                student,
                title: title.clone(),
                description,
                github_url,
                demo_url,
                skills,
                created_at: self.env().block_timestamp(),
                unlock_count: 0,
                avg_rating: 0,
            };

            self.projects.insert(project_id, &project);

            let mut student_project_ids = self.student_projects.get(student).unwrap_or_default();
            student_project_ids.push(project_id);
            self.student_projects.insert(student, &student_project_ids);

            self.next_project_id = self.next_project_id.saturating_add(1);

            self.env().emit_event(ProjectCreated {
                project_id,
                student,
                title,
            });

            project_id
        }

        #[ink(message, payable)]
        pub fn unlock_project(&mut self, project_id: u64) -> Result<()> {
            let reviewer = self.env().caller();
            let payment = self.env().transferred_value();

            let mut project = self.projects.get(project_id).ok_or(Error::ProjectNotFound)?;

            if project.student == reviewer {
                return Err(Error::CannotReviewOwnProject);
            }

            if self.unlocked.get((project_id, reviewer)).unwrap_or(false) {
                return Err(Error::AlreadyUnlocked);
            }

            if payment < self.unlock_price {
                return Err(Error::InsufficientPayment);
            }

            // Transfer student share
            if self.env().transfer(project.student, self.student_share).is_err() {
                return Err(Error::TransferFailed);
            }

            // Transfer platform share
            if self.env().transfer(self.platform_treasury, self.platform_share).is_err() {
                return Err(Error::TransferFailed);
            }

            // Mark as unlocked
            self.unlocked.insert((project_id, reviewer), &true);
            project.unlock_count = project.unlock_count.saturating_add(1);
            self.projects.insert(project_id, &project);

            self.env().emit_event(ProjectUnlocked {
                project_id,
                reviewer,
                amount_paid: payment,
            });

            Ok(())
        }

        #[ink(message)]
        pub fn submit_review(
            &mut self,
            project_id: u64,
            rating: u8,
            comment: String,
        ) -> Result<()> {
            let reviewer = self.env().caller();

            if !self.unlocked.get((project_id, reviewer)).unwrap_or(false) {
                return Err(Error::NotUnlocked);
            }

            if rating == 0 || rating > 5 {
                return Err(Error::InvalidRating);
            }

            let review = Review {
                reviewer,
                rating,
                comment,
                timestamp: self.env().block_timestamp(),
            };

            let mut reviews = self.reviews.get(project_id).unwrap_or_default();
            reviews.push(review);
            self.reviews.insert(project_id, &reviews);

            // Update average rating
            let mut project = self.projects.get(project_id).ok_or(Error::ProjectNotFound)?;
            let total_rating: u32 = reviews.iter().map(|r| u32::from(r.rating)).sum();
            let review_count: u32 = reviews.len().try_into().unwrap_or(1);
            project.avg_rating = total_rating.checked_div(review_count)
                .and_then(|avg| u8::try_from(avg).ok())
                .unwrap_or(0);
            self.projects.insert(project_id, &project);

            self.env().emit_event(ReviewSubmitted {
                project_id,
                reviewer,
                rating,
            });

            Ok(())
        }

        #[ink(message)]
        pub fn get_project(&self, project_id: u64) -> Option<Project> {
            self.projects.get(project_id)
        }

        #[ink(message)]
        pub fn get_student_projects(&self, student: AccountId) -> Vec<u64> {
            self.student_projects.get(student).unwrap_or_default()
        }

        #[ink(message)]
        pub fn get_reviews(&self, project_id: u64) -> Vec<Review> {
            self.reviews.get(project_id).unwrap_or_default()
        }

        #[ink(message)]
        pub fn is_unlocked(&self, project_id: u64, reviewer: AccountId) -> bool {
            self.unlocked.get((project_id, reviewer)).unwrap_or(false)
        }

        #[ink(message)]
        pub fn get_unlock_price(&self) -> Balance {
            self.unlock_price
        }
    }

    // ==================== TESTS ====================

    #[cfg(test)]
    mod tests {
        use super::*;

        #[ink::test]
        fn create_project_works() {
            let accounts = ink::env::test::default_accounts::<ink::env::DefaultEnvironment>();
            let mut contract = DotgoPortfolio::new(accounts.alice);

            let project_id = contract.create_project(
                String::from("My Portfolio"),
                String::from("A cool project"),
                String::from("https://github.com/user/repo"),
                String::from("https://demo.com"),
                vec![String::from("Rust"), String::from("React")],
            );

            assert_eq!(project_id, 0);
            assert!(contract.get_project(project_id).is_some());
        }

        #[ink::test]
        fn unlock_and_review_works() {
            let accounts = ink::env::test::default_accounts::<ink::env::DefaultEnvironment>();
            let mut contract = DotgoPortfolio::new(accounts.alice);

            let project_id = contract.create_project(
                String::from("My Portfolio"),
                String::from("A cool project"),
                String::from("https://github.com/user/repo"),
                String::from("https://demo.com"),
                vec![String::from("Rust")],
            );

            // Switch to Bob (reviewer)
            ink::env::test::set_caller::<ink::env::DefaultEnvironment>(accounts.bob);
            ink::env::test::set_value_transferred::<ink::env::DefaultEnvironment>(3_000_000_000_000);

            let result = contract.unlock_project(project_id);
            assert!(result.is_ok());

            let review_result = contract.submit_review(project_id, 5, String::from("Great!"));
            assert!(review_result.is_ok());

            let reviews = contract.get_reviews(project_id);
            assert_eq!(reviews.len(), 1);
            assert_eq!(reviews[0].rating, 5);
        }
    }
}
