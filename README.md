# TimerDoc Mobile App

TimerDoc is a Document Management System designed to help users register documents, track deadlines, and manage responsibilities. The platform allows users to associate each document with its required completion period, the client requesting the document, and the person responsible for its delivery. This ensures efficient document tracking, accountability, and timely completion for organizations and teams.

This is the mobile application for the TimerDoc platform, built with React Native, Expo, and TypeScript.

---

## Table of Contents

- [Features](#features)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Scripts](#scripts)
- [Configuration](#configuration)
- [Testing](#testing)
- [Contributing](#contributing)
- [License](#license)

---

## Features

- Cross-platform mobile app using React Native and Expo
- Document registration and management
- Deadline and responsibility tracking
- Company and user management
- Authentication and company selection
- Internationalization (i18n) support
- Modern UI with custom components
- Docker and EAS build support

---

## Project Structure

```
timerdoc__app/
├── app/
│   ├── _layout.tsx
│   ├── index.tsx
│   ├── (public)/
│   ├── (private)/
│   └── ...
├── assets/
│   ├── fonts/
│   └── images/
├── components/
├── constants/
├── context/
├── dto/
├── hook/
├── utils/
├── package.json
├── app.json
├── tsconfig.json
└── ...
```

---

## Getting Started

1. **Install dependencies:**
   ```sh
   npm install
   ```

2. **Start the development server:**
   ```sh
   npm run start
   ```

3. **Run on Android/iOS/Web:**
   ```sh
   npm run android   # For Android
   npm run ios       # For iOS
   npm run web       # For Web
   ```

---

## Scripts

- `npm run start` – Start Expo development server
- `npm run android` – Run app on Android emulator/device
- `npm run ios` – Run app on iOS simulator/device
- `npm run web` – Run app in web browser
- `npm run build` – Build app with EAS
- `npm run test` – Run tests

See all scripts in [package.json](c:/DEV/Pessoal/Timerdoc/timerdoc__app/package.json).

---

## Configuration

- App configuration in [`app.json`](c:/DEV/Pessoal/Timerdoc/timerdoc__app/app.json)
- TypeScript config in [`tsconfig.json`](c:/DEV/Pessoal/Timerdoc/timerdoc__app/tsconfig.json)
- Environment variables via `.env` (if used)

---

## Testing

- Tests are written with [Jest](https://jestjs.io/) and [jest-expo](https://docs.expo.dev/guides/testing-with-jest/).
- Run all tests:
  ```sh
  npm test
  ```

---

## Contributing

Pull requests are welcome! Please lint and test your code before submitting.

---

## License

This project is **UNLICENSED**. See [package.json](c:/DEV/Pessoal/Timerdoc/timerdoc__app/package.json)
