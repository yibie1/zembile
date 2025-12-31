# Contributing to Zembile

Thank you for your interest in contributing to Zembile! This document provides guidelines and information for contributors.

## 🌟 How to Contribute

### Reporting Issues
- Use GitHub Issues to report bugs or request features
- Provide detailed information including steps to reproduce
- Include screenshots for UI-related issues
- Specify browser and device information

### Suggesting Features
- Check existing issues to avoid duplicates
- Provide clear use cases and benefits
- Consider Ethiopian market context and cultural sensitivity
- Include mockups or examples when helpful

### Code Contributions

#### Getting Started
1. Fork the repository
2. Clone your fork locally
3. Create a new branch for your feature/fix
4. Make your changes
5. Test thoroughly
6. Submit a pull request

#### Development Setup
```bash
# Clone your fork
git clone https://github.com/yourusername/zembile.git
cd zembile

# Install dependencies
cd frontend && npm install
cd ../api && npm install

# Start development servers
npm run dev # in both frontend and api directories
```

## 📋 Development Guidelines

### Code Style
- **JavaScript/React**: Follow existing patterns and conventions
- **CSS**: Use Tailwind CSS utility classes
- **File Naming**: Use PascalCase for components, camelCase for utilities
- **Comments**: Add JSDoc comments for functions and components

### Component Guidelines
- Keep components focused and reusable
- Use React hooks and functional components
- Implement proper error boundaries
- Ensure mobile responsiveness
- Follow accessibility best practices

### Ethiopian Context
- Use Ethiopian Birr (ETB) for all pricing
- Support Ethiopian phone number formats (+251-X-XX-XX-XX-XX)
- Include Ethiopian regions in address forms
- Respect cultural sensitivities in content and design
- Use appropriate Ethiopian flag colors (🟢🟡🔴)

### Testing
- Test on multiple browsers (Chrome, Firefox, Safari, Edge)
- Verify mobile responsiveness on various screen sizes
- Test authentication flows thoroughly
- Validate payment integration (use test mode)
- Check accessibility with screen readers

## 🔧 Technical Standards

### Frontend (React)
- Use TypeScript for new components (optional but preferred)
- Implement proper error handling with try-catch blocks
- Use React Context for state management
- Follow React best practices and hooks guidelines
- Ensure components are accessible (ARIA labels, semantic HTML)

### Backend (Node.js)
- Use Express.js conventions
- Implement proper error handling middleware
- Validate all inputs and sanitize data
- Use JWT for authentication
- Follow RESTful API design principles

### Security
- Never commit sensitive data (API keys, passwords)
- Use environment variables for configuration
- Implement proper input validation
- Follow OWASP security guidelines
- Use HTTPS in production

## 🎨 Design Guidelines

### UI/UX Principles
- **Ethiopian Heritage**: Incorporate traditional design elements respectfully
- **Accessibility**: Ensure WCAG 2.1 AA compliance
- **Mobile First**: Design for mobile devices primarily
- **Performance**: Optimize for fast loading times
- **Consistency**: Follow established design patterns

### Color Palette
- **Primary**: Ethiopian flag colors (Green #228B22, Yellow #FFD700, Red #DC143C)
- **Neutral**: Grays for text and backgrounds
- **Accent**: Zembile yellow (#FFD700) for CTAs and highlights

### Typography
- Use system fonts for performance
- Maintain proper contrast ratios
- Ensure readability on all screen sizes
- Support Amharic text when applicable

## 📝 Pull Request Process

### Before Submitting
- [ ] Code follows project conventions
- [ ] All tests pass
- [ ] Mobile responsiveness verified
- [ ] Accessibility checked
- [ ] Ethiopian context considered
- [ ] Documentation updated if needed

### PR Description Template
```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Tested on desktop browsers
- [ ] Tested on mobile devices
- [ ] Authentication flows tested
- [ ] Payment integration tested (test mode)

## Screenshots
Include screenshots for UI changes

## Ethiopian Context
Describe any Ethiopian-specific considerations
```

### Review Process
1. Automated checks must pass
2. Code review by maintainers
3. Testing in development environment
4. Approval and merge

## 🌍 Cultural Sensitivity

### Ethiopian Market Considerations
- **Language**: Support for Amharic text and RTL layouts
- **Currency**: Always use Ethiopian Birr (ETB)
- **Addresses**: Include Ethiopian regions and cities
- **Phone Numbers**: Support Ethiopian format (+251)
- **Payment Methods**: Focus on local payment solutions
- **Cultural Respect**: Avoid stereotypes and ensure authentic representation

### Content Guidelines
- Use respectful language about Ethiopian culture
- Ensure product descriptions are accurate and culturally appropriate
- Include proper attribution for traditional designs
- Support local artisans and businesses

## 🚀 Release Process

### Version Management
- Follow semantic versioning (MAJOR.MINOR.PATCH)
- Update CHANGELOG.md for each release
- Tag releases in Git
- Update documentation as needed

### Deployment
- Test in staging environment
- Verify all integrations work
- Update production environment variables
- Monitor for issues post-deployment

## 📚 Resources

### Documentation
- [React Documentation](https://reactjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Express.js Documentation](https://expressjs.com/)
- [Chapa API Documentation](https://developer.chapa.co/)

### Ethiopian Context
- [Ethiopian Birr Exchange Rates](https://www.nbe.gov.et/)
- [Ethiopian Postal Codes](https://www.ethiopianpostal.com/)
- [Ethiopian Phone Number Format](https://en.wikipedia.org/wiki/Telephone_numbers_in_Ethiopia)

### Design Resources
- [Ethiopian Flag Colors](https://en.wikipedia.org/wiki/Flag_of_Ethiopia)
- [Traditional Ethiopian Patterns](https://www.ethiopianculture.org/)
- [Accessibility Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)

## 🤝 Community

### Communication
- **GitHub Discussions**: For questions and general discussion
- **GitHub Issues**: For bug reports and feature requests
- **Pull Requests**: For code contributions
- **Email**: For sensitive matters or business inquiries

### Code of Conduct
- Be respectful and inclusive
- Welcome newcomers and help them learn
- Focus on constructive feedback
- Respect cultural differences and perspectives
- Follow GitHub's Community Guidelines

## 🙏 Recognition

Contributors will be recognized in:
- README.md contributors section
- Release notes for significant contributions
- Special recognition for cultural consultants
- Annual contributor appreciation

Thank you for helping make Zembile a better platform for Ethiopian commerce and culture! 🇪🇹