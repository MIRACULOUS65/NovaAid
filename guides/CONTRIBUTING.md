# Contributing to NovaAid

Thank you for your interest in contributing to NovaAid! This document provides guidelines and instructions for contributing to the project.

## Table of Contents
- [Code of Conduct](#code-of-conduct)
- [How Can I Contribute?](#how-can-i-contribute)
- [Development Setup](#development-setup)
- [Coding Standards](#coding-standards)
- [Pull Request Process](#pull-request-process)
- [Issue Guidelines](#issue-guidelines)

## Code of Conduct

### Our Pledge
We pledge to make participation in our project a harassment-free experience for everyone, regardless of age, body size, disability, ethnicity, gender identity, level of experience, nationality, personal appearance, race, religion, or sexual identity and orientation.

### Expected Behavior
- Be respectful and inclusive
- Welcome newcomers
- Provide constructive feedback
- Focus on what is best for the community
- Show empathy towards other community members

### Unacceptable Behavior
- Harassment, trolling, or discriminatory comments
- Personal or political attacks
- Publishing others' private information
- Any conduct that could be considered inappropriate in a professional setting

## How Can I Contribute?

### Reporting Bugs
Before creating a bug report:
- Check the existing issues to avoid duplicates
- Collect information about the bug (steps to reproduce, expected behavior, screenshots, etc.)

**Bug Report Template:**
```markdown
**Describe the bug**
A clear description of what the bug is.

**To Reproduce**
1. Go to '...'
2. Click on '...'
3. See error

**Expected behavior**
What you expected to happen.

**Screenshots**
If applicable, add screenshots.

**Environment:**
- OS: [e.g. Windows 11]
- Browser: [e.g. Chrome 118]
- Node.js version: [e.g. 18.17.0]
```

### Suggesting Features
Feature suggestions are welcome! Please provide:
- Clear description of the feature
- Why it would be useful
- Possible implementation approach
- Mockups or examples (if applicable)

### Code Contributions
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## Development Setup

### Prerequisites
- Node.js 18+
- Git
- MetaMask
- Firebase account
- Clerk account

### Initial Setup
```bash
# Clone your fork
git clone https://github.com/YOUR_USERNAME/NovaAid.git
cd NovaAid

# Install dependencies for all services
cd FRONTEND/novaaid-app && npm install
cd "../NGO SECTION/ngo-portal" && npm install
cd ../../BACKEND/novaaid-app-backend && npm install
cd ../../BLOCKCHAIN/novaaid-app-blockchain && npm install
```

### Environment Setup
Create `.env` files in:
- `BACKEND/novaaid-app-backend/`
- `FRONTEND/novaaid-app/`
- `FRONTEND/NGO SECTION/ngo-portal/`
- `BLOCKCHAIN/novaaid-app-blockchain/`

See `.env.example` files in each directory for required variables.

### Running Tests
```bash
# Backend tests
cd BACKEND/novaaid-app-backend
npm test

# Smart contract tests
cd BLOCKCHAIN/novaaid-app-blockchain
npm test

# Frontend tests
cd FRONTEND/novaaid-app
npm test
```

## Coding Standards

### JavaScript/TypeScript
- Use TypeScript for all new frontend code
- Follow ESLint configuration
- Use meaningful variable names
- Add JSDoc comments for functions
- Prefer `const` over `let`, avoid `var`

**Example:**
```typescript
/**
 * Generates a Semaphore identity commitment
 * @param salt - Random 256-bit salt
 * @returns Commitment hash as hex string
 */
async function generateCommitment(salt: string): Promise<string> {
  // Implementation
}
```

### Solidity
- Follow Solidity style guide
- Use OpenZeppelin contracts when possible
- Add NatSpec comments
- Optimize for gas efficiency
- Always include tests

**Example:**
```solidity
/**
 * @notice Pay verification fee to become verified
 * @dev Requires exactly 0.01 CELO payment
 */
function payVerificationFee() external payable {
    require(msg.value == verificationFee, "Invalid fee amount");
    // Implementation
}
```

### Commit Messages
Follow conventional commits format:

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types:**
- `feat` - New feature
- `fix` - Bug fix
- `docs` - Documentation changes
- `style` - Code style changes
- `refactor` - Code refactoring
- `test` - Adding tests
- `chore` - Maintenance tasks

**Examples:**
```
feat(video): add screen sharing functionality

Implemented screen sharing using Daily.co API.
Users can now share their screen during video calls.

Closes #123
```

```
fix(payment): correct verification fee validation

Fixed bug where contract accepted incorrect payment amounts.
Now enforces exact 0.01 CELO requirement.

Fixes #456
```

### Branch Naming
- `feature/description` - New features
- `bugfix/description` - Bug fixes
- `docs/description` - Documentation
- `refactor/description` - Refactoring
- `test/description` - Tests

**Examples:**
- `feature/multi-language-support`
- `bugfix/wallet-connection-error`
- `docs/api-reference-update`

## Pull Request Process

### Before Submitting
- [ ] Code follows project style guidelines
- [ ] All tests pass locally
- [ ] New tests added for new features
- [ ] Documentation updated (if needed)
- [ ] No console.log or debugging code
- [ ] Commit messages follow convention
- [ ] Branch is up to date with main

### PR Template
```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
Describe how you tested your changes

## Checklist
- [ ] My code follows the project style
- [ ] I have added tests
- [ ] All tests pass
- [ ] Documentation updated
- [ ] No breaking changes (or documented)

## Screenshots
If applicable, add screenshots
```

### Review Process
1. Automated tests must pass
2. At least one maintainer review required
3. Address all review comments
4. Keep PR scope focused (one feature/fix per PR)
5. Squash commits before merge (if requested)

## Issue Guidelines

### Creating Issues
- Use clear, descriptive titles
- Provide detailed description
- Add relevant labels
- Link related issues/PRs
- Include reproduction steps (for bugs)

### Issue Labels
- `bug` - Something isn't working
- `enhancement` - New feature request
- `documentation` - Documentation improvements
- `good first issue` - Good for newcomers
- `help wanted` - Extra attention needed
- `priority: high` - Critical issues
- `priority: low` - Nice to have
- `wontfix` - Will not be worked on

## Questions?

- 💬 Join GitHub Discussions
- 📧 Email: support@novaaid.org
- 🐛 Open an issue

## Recognition

All contributors will be:
- Listed in CONTRIBUTORS.md
- Mentioned in release notes
- Eligible for contributor badges

Thank you for contributing to NovaAid! 🙏
