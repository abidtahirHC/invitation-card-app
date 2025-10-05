# Wedding Invitation Generator

A beautiful React-based web application for generating customizable wedding invitations with PDF download functionality.

## Features

- **Interactive Form**: Customize invitation details including names, dates, venue, and contact information
- **Live Preview**: See changes in real-time as you edit the form
- **PDF Export**: Download the invitation as a high-quality PDF
- **Responsive Design**: Works perfectly on desktop and mobile devices
- **Beautiful Styling**: Elegant design with Tailwind CSS
- **Invitee Sticker**: A decorative sticker-style label at the bottom with invitee name and address (serif font), separated by an asterisk divider
- **Program Controls**: Ladies/Gents counts with bold emphasis when entered, and a "Full Family" option that displays a centered label across both columns
- **QR Code Block**: Upload a QR image and show a larger scanner with caption (kept between RSVP and compliments)
- **Designer Borders**: Layered outer/inner amber borders for a premium print look

## Quick Start

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm start
   ```

3. Open your browser and visit `http://localhost:3000`

## Project Locations

- Local path: `/Users/abc/wedding-invitation-app`
- Intended GitHub remote: `https://github.com/abidtahirHC/wedding-app` (set this as your origin to push)

## Run in IntelliJ IDEA Community

IntelliJ Community doesn’t include the Node.js run config UI, so use the built‑in Terminal:

1. File → Open → select `/Users/abc/wedding-invitation-app`
2. View → Tool Windows → Terminal, then:
   ```bash
   npm install
   npm start
   ```
3. Open `http://localhost:3000`

Optional one‑click run:
- Run → Edit Configurations → + → Shell Script
  - Name: Start Dev
  - Script text: `npm start`
  - Working directory: `/Users/abc/wedding-invitation-app`

## Connect and Push to GitHub

Set the remote and push using HTTPS (Personal Access Token recommended):
```bash
git remote remove origin 2>/dev/null || true
git remote add origin https://github.com/abidtahirHC/wedding-app.git
git push -u origin main
```

If you prefer SSH:
```bash
ssh-keygen -t ed25519 -C "you@example.com"
cat ~/.ssh/id_ed25519.pub   # add this in GitHub → Settings → SSH and GPG keys
git remote remove origin 2>/dev/null || true
git remote add origin git@github.com:abidtahirHC/wedding-app.git
git push -u origin main
```

## Usage

1. **Fill the Form**: Enter the wedding details in the left panel
2. **Preview**: Click "Preview" to see how the invitation looks
3. **Download**: Click "Download PDF" to save the invitation as a PDF file

### Tips
- Use the "Full Family" checkbox for any program row to show a combined label between Ladies and Gents.
- When numbers are provided for Ladies/Gents, they automatically render in bold for better readability.
- Upload a QR image (e.g., Google Maps code) and it will appear with the caption under RSVP.
- Invitee name/address render inside a sticker at the bottom; adjust values from the form.

## Customizable Fields

- Invitee Name
- Wedding Date
- Invitee Address (optional)
- Venue Information
- Host Names
- Couple Names
- RSVP Contact Numbers
- Additional Notes
 - Invitee Name and Address Sticker
 - Program section (Ladies/Gents counts or Full Family)
 - QR Image and Caption (e.g., "Scan For Location")

## Technologies Used

- **React**: Frontend framework
- **Tailwind CSS**: Styling and responsive design
- **jsPDF**: PDF generation
- **html2canvas**: HTML to canvas conversion for PDF export

## Available Scripts

### `npm start`
Runs the app in development mode at [http://localhost:3000](http://localhost:3000)

### `npm run build`
Builds the app for production to the `build` folder

### `npm test`
Launches the test runner in interactive watch mode

## Deployment

You can deploy this application to any static hosting service like:
- Netlify
- Vercel
- GitHub Pages
- AWS S3 + CloudFront

To create a production build:
```bash
npm run build
```

## Recent Updates

- Added invitee sticker with serif typography and asterisk divider
- Centered "Full Family" label across Ladies/Gents with optional slight left offset for layout balance
- Bold emphasis for entered Ladies/Gents numbers and RSVP contacts
- Larger QR scanner size and positioned between RSVP and compliments
- Enhanced designer borders for outer card and inner content

## License

This project is open source and available under the MIT License.
