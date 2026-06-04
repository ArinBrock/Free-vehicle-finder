# CONTRIBUTING.md - Free Vehicle Finder

Thank you for your interest in contributing to **Free Vehicle Finder**! This project is about helping people find free vehicles to improve their lives. Your contributions make a real difference.

## 🎯 Our Vision

We're building a platform that:
- Makes free vehicles easily discoverable
- Helps verify vehicle legitimacy and safety
- Empowers financially unstable individuals
- Improves transportation accessibility

## 🤝 How to Contribute

### 1. Reporting Bugs
If you find a bug, please:
1. Check if it's already reported in [Issues](https://github.com/ArinBrock/Free-vehicle-finder/issues)
2. Create a new issue with:
   - Clear title describing the bug
   - Steps to reproduce
   - Expected vs actual behavior
   - Device/OS information
   - Screenshots if applicable

### 2. Suggesting Features
Have a great idea? Create an issue with:
- Clear, descriptive title
- Detailed explanation of the feature
- Why you think it's important
- How it benefits users
- Any mockups or examples

### 3. Code Contributions
Ready to code? Follow these steps:

#### Setup
```bash
# Fork the repository
# Clone your fork
git clone https://github.com/YOUR-USERNAME/Free-vehicle-finder.git
cd Free-vehicle-finder

# Add upstream remote
git remote add upstream https://github.com/ArinBrock/Free-vehicle-finder.git

# Install dependencies
npm install
```

#### Development
```bash
# Create a feature branch
git checkout -b feature/your-feature-name

# Make your changes
# Follow code style guidelines (see below)

# Test your changes
npm test
npm start  # Test on device/emulator

# Commit with clear messages
git commit -m "Add: Description of your feature"

# Push to your fork
git push origin feature/your-feature-name
```

#### Submit PR
1. Go to GitHub and create Pull Request
2. Describe what you changed and why
3. Reference related issues
4. Wait for review feedback

## 📋 Code Guidelines

### React/TypeScript Standards
```typescript
// ✅ Good
export default function VehicleCard({ vehicle }: Props) {
  const [state, setState] = useState<string>('');
  
  const handleClick = () => {
    // Action
  };
  
  return (
    <View>
      <Text>{vehicle.title}</Text>
    </View>
  );
}

// ❌ Bad
export default function vehicleCard(props) {
  var state = useState('');
  
  const handleClick = () => { /* Action */ };
  
  return <View><Text>{props.vehicle.title}</Text></View>;
}
```

### File Naming
```
Screens:    PascalCase + Screen (MapScreen.tsx)
Components: PascalCase (VehicleCard.tsx)
Services:   camelCase + Service (vehicleService.ts)
Utils:      camelCase (helpers.ts)
Types:      PascalCase (Vehicle.ts)
```

### Comments & Documentation
```typescript
/**
 * Description of what the function does
 * @param param1 - Description
 * @returns Description of return value
 */
export function myFunction(param1: string): string {
  // Complex logic explanation
  return result;
}
```

### Styling
- Use StyleSheet for all styles
- Keep components responsive
- Follow Material Design principles
- Test on both Android and iOS

```typescript
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  text: {
    fontSize: 16,
    color: '#333',
  },
});
```

## 🧪 Testing

All contributions should include tests:

```bash
# Run all tests
npm test

# Run specific test
npm test -- MapScreen.test.tsx

# Watch mode
npm test -- --watch

# Coverage
npm test -- --coverage
```

### Test Example
```typescript
describe('VINVerificationScreen', () => {
  it('should validate 17-character VIN', () => {
    const vin = '1HGCM82633A123456';
    const result = validateVIN(vin);
    expect(result).toBe(true);
  });
  
  it('should reject invalid VIN checksum', () => {
    const vin = '1HGCM82633A123457';
    const result = validateVIN(vin);
    expect(result).toBe(false);
  });
});
```

## 📚 Documentation

When contributing, update documentation:
- Update README.md if needed
- Add JSDoc comments
- Update BUILD_INSTRUCTIONS.md for build changes
- Keep CHANGELOG.md updated

## 🚀 Development Workflow

### Before Starting
```bash
git fetch upstream
git rebase upstream/main
```

### During Development
```bash
# Run app frequently
npm start

# Check types
npm run type-check

# Lint code
npm run lint

# Run tests
npm test
```

### Before Submitting
```bash
# Update from main
git fetch upstream
git rebase upstream/main

# Resolve any conflicts
# Test again
npm test
npm start

# Push to your branch
git push origin feature/your-feature-name
```

## 📝 Commit Messages

Write clear, descriptive commit messages:

```
Add: VIN validation using NHTSA algorithm
Fix: Map markers not updating on location change
Refactor: Extract title verification logic
Docs: Update API integration guide
Test: Add VIN verification tests
```

Format:
- **Add**: New feature
- **Fix**: Bug fix
- **Refactor**: Code improvement
- **Docs**: Documentation
- **Test**: Test additions
- **Style**: Formatting/style
- **Chore**: Maintenance

## 🎨 Design Principles

- **User-Centric**: Always consider end users
- **Accessibility**: Support all abilities
- **Performance**: Optimize for mobile
- **Privacy**: Protect user data
- **Security**: Follow best practices

## 🔍 Review Process

1. **Automated Checks**
   - Tests must pass
   - Linting must pass
   - TypeScript must compile

2. **Code Review**
   - Maintainers review code
   - Feedback is constructive
   - Discussion of approach

3. **Approval**
   - At least 1 approval required
   - All comments resolved
   - Ready to merge

## ❓ Questions?

- 💬 Comment on issues/PRs
- 📧 Open a discussion
- 🐛 Check existing issues
- 📚 Read documentation

## 🙏 Thank You!

Your contributions help make transportation accessible to everyone. Every fix, feature, and improvement brings us closer to our mission.

**Together, we can help people find the freedom to move forward! 🚗❤️**

---

**Last Updated**: June 2026
