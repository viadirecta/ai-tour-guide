# AI Tour Guide - Admin Instructions

This document provides instructions for both **Super Admins** and individual **Tour Guides** on how to manage and configure the AI Tour Guide platform.

---

## 1. Super Admin Panel

The Super Admin has master control over the entire platform. Their primary role is to manage and approve tour guide profiles. They can also create tours directly.

### Accessing the Super Admin Panel

1.  Navigate to your application's URL and append `/#/superadmin`.
    *   **Example:** `https://your-domain.com/#/superadmin`
2.  You will be prompted for the password.
    *   **Default Password:** `superadmin`

### Super Admin Responsibilities

-   **Create a New Tour:**
    1.  Click the "Create New Tour" button.
    2.  Fill in the details: Tour Name, Guide's Name, Guide's Email, and a temporary Admin Password for the guide.
    3.  The system automatically generates a unique Tour ID. The tour will be created with an "Active" status.
-   **Approve Pending Registrations:**
    1.  New guides who register via the public "Guide Registration" link will appear in the dashboard with a "Pending" status.
    2.  Click **Approve** to activate their tour and allow them to log in.
    3.  Click **Deny** to permanently delete their registration request.
-   **Manage Existing Tours:**
    1.  **Edit:** Click the **Settings** icon next to a tour to edit its name, guide details, or password.
    2.  **Suspend/Reactivate:** Change the status of a tour to temporarily disable or re-enable it.
    3.  **Delete:** Click the **Delete** icon to permanently remove a tour and all its data. **Warning:** This is irreversible.

---

## 2. Guide Registration and Admin Panel

Individual guides can register for an account, which must then be approved by a Super Admin. Once approved, they can access their own admin panel to customize their tour.

### Registration

1.  From the homepage, click on "Guide Registration".
2.  Fill out the form with your name, email, desired password, tour name, and a brief description of your tour.
3.  After submitting, your account will be in a "Pending" state until a Super Admin approves it.

### Accessing the Guide Admin Panel

1.  Once approved, go to the "Guide Login" page from the homepage.
2.  Log in with the email and password you registered with.
3.  Alternatively, you can go directly to your admin URL:
    *   **Example:** `https://your-domain.com/#/admin/your-tour-id`

### Guide Admin Responsibilities

Your admin panel is divided into four main sections:

#### a. System Instruction

This is the most important part of your configuration. It defines the personality and core knowledge of your AI guide.

-   **What to write:** Be descriptive. Explain who the AI is, what its tone should be (e.g., funny, academic, friendly), what it knows about, and its main goal.
-   **Example:** "You are a hip, modern guide for a street art tour in Paris. You know all about artists like Invader, C215, and Banksy. Your tone is cool, informative, and appreciative of urban art."

#### b. Promotional Tools & QR Codes

This section provides tools to help you promote your tour and make it more interactive.

-   **Main Tour QR Code:**
    -   You will find a QR code that links directly to your tour's chat page (e.g., `https://tours.via-directa.com/#/tour/your-tour-id`).
    -   **How to use:** Download this QR code and print it on flyers, posters, or at the starting point of your tour. When visitors scan it, they will be taken directly to your AI guide.

#### c. Tip Jar Configuration

This section allows you to set up how you receive tips from tourists. Empty fields will not be shown on the public tip page.

-   **Tip Message:** Write a friendly message encouraging users to leave a tip.
-   **PayPal.me Link:** Enter your full PayPal.me link (e.g., `https://paypal.me/yourname`).
-   **Bizum / Other Info:** Use this for any text-based payment method (e.g., "Bizum: 600 123 456" or "Cash App: $yourtag").
-   **Payment QR Code:** Upload a QR code image from your payment app (e.g., Venmo, Cash App, Bizum QR). The app will display this image for users to scan.

#### d. Local Knowledge Base

This is a powerful feature for providing instant, guaranteed answers and media for specific landmarks or questions. When a user's message exactly matches a `Keyword`, your pre-defined content is shown immediately, bypassing the AI.

-   **Keyword:** The exact phrase the user must type or scan (e.g., `QR-ref:BARCINO_WALL`). This is case-insensitive.
-   **Description:** The text information you want to display for that keyword.
-   **Media (Optional):** You can add **either** an image **or** a video to a reference. This is perfect for showing historical photos, artwork, or short video clips.
    -   **Image:** Upload an image file directly. It will be displayed to the user along with the description.
    -   **Video:** You can either **upload a video file** directly from your computer or **paste a public URL** to a video file (e.g., `.mp4`). A video player will be shown to the user.
-   **Keyword QR Code:**
    -   Once you enter a keyword for a reference, a "Show QR Code" button will appear.
    -   **How to use:** Click the button to generate, view, and download a QR code for that specific keyword. Print this code and place it at the physical location (e.g., on a sign near a statue). When a tourist scans it, the app will instantly display the information you've prepared for that reference.

**Important:** You can only have an image OR a video for a single reference item, not both.

### Importing & Exporting Configuration

-   **Export:** Save your current configuration (System Instruction, References, Tip Info) to a `.json` file on your computer. This is great for making backups.
-   **Import:** Load a previously saved `.json` file to restore a configuration. This will overwrite your current settings in the panel, so remember to click **Save All Changes** after importing.