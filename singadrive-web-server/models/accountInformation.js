class AccountInformation {
  constructor() {
    this.display_name = '';
    this.description = '';
    this.external_links = [];
    this.birthday = null;
    // PostgreSQL will handle null...
    // (won't update the column if its null)
    this.email = null;
    this.hashed_password = null;
  }
}

module.exports = AccountInformation;
