# Smart Input Validation Attributes

This repository demonstrates a **proposed HTML `validation` attribute** for input fields, enabling declarative, standardized validation without relying on extra JavaScript for basic use cases.

## Features

- **Declarative validation via `validation` attribute**:
  - `validation="name"` → only letters and spaces
  - `validation="phone"` → international phone numbers
  - `validation="email"` → email format
  - `validation="password"` → password strength check
  - `validation="confirm"` → confirm password matches
- **Real-time validation feedback**
- **Password strength meter**
- **Password visibility toggle (eye icon)**
- **Safe demo:** no form data is submitted anywhere

## Goal

The goal is to propose a **native HTML feature** for declarative input validation, making web forms:

- Lightweight and fast (no extra JS required)
- Consistent across browsers
- Beginner-friendly and accessible
- Integrable with browser autofill and password managers

## Usage

Open `index.html` in a browser — no server required.

```html
<input type="text" validation="name" placeholder="Full Name">
<input type="tel" validation="phone" placeholder="+1 123 456 7890">
<input type="password" validation="password" placeholder="Password">
<input type="password" validation="confirm" for="password" placeholder="Confirm Password">
