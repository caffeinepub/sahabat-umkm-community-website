# Sahabat UMKM Community Website

## Overview
A community website for UMKM (Usaha Mikro, Kecil, dan Menengah) members featuring business profiles, community updates, educational content, and member registration. The application uses Indonesian language throughout and follows a soft blue color palette that harmonizes with the Sahabat UMKM logo branding (incorporating blue, orange, red, and white accents).

## Design Theme
- Primary background color scheme: soft blue tones (gentle and not overly bright or saturated)
- Maintains good contrast for text readability
- Preserves Sahabat UMKM branding elements with blue, orange, red, and white accents
- All sections styled consistently with the soft blue palette

## Logo Implementation
- Uses the `logo flat SU BPC Karawang png.png` image as the primary community logo
- Logo appears in both header and footer components
- Maintains appropriate padding and scaling for responsiveness on desktop and mobile views
- Header and footer background colors adjusted if necessary to ensure logo visibility and contrast
- Logo preserves its original aspect ratio and branding elements (blue text, colorful arrow design)

## Core Features

### Admin Panel
- Visual admin panel appears at the top of all pages when an active admin session is detected
- Panel includes quick navigation buttons:
  - "Kelola Artikel" (Manage Articles)
  - "Kelola Galeri" (Manage Gallery)
  - "Kelola Produk Anggota" (Manage Member Products)
  - "Kelola Konten Edukasi" (Manage Educational Content)
  - "Kelola Anggota" (Manage Members)
  - "Kelola Pengajuan Produk" (Manage Product Submissions)
- Panel includes "Keluar Admin" (Logout) button prominently placed in the top-right corner
- Logout button ends admin session, hides all admin-specific controls, and reverts UI to normal public website view
- Panel is styled with soft blue theme and integrates seamlessly with site design
- Responsive layout that adapts to different screen sizes
- Panel is completely hidden for regular users and guests
- Only visible when admin is authenticated and logged in

### Homepage
- Hero section introducing "Sahabat UMKM" with prominent logo display using `logo flat SU BPC Karawang png.png`
- Hero background uses the `dynamic-data-visualization-3d.jpg` image as a full-width background with a semi-transparent soft blue overlay to maintain text readability and integrate with the site's soft blue theme
- Background image covers the full width and height of the hero section with responsive cover positioning (center) and maintains visual consistency across all screen sizes
- Semi-transparent overlay ensures excellent text contrast and readability while preserving the background image's visual appeal
- Welcome message and community overview with existing text, buttons, and layout preserved
- "Bergabung Sekarang" (Join Now) button that redirects to external link: https://form.svhrt.com/62132b74a14ddb59768a98f3
- External link opens in a new browser tab for better user experience
- Button maintains consistent design and positioning with existing theme
- Quick navigation to main sections
- Featured content from news
- "Produk Anggota" section with large header "Produk Anggota" displaying all published member products from backend
- Product section appears below existing content (after "Tentang Kami") using clean and engaging grid layout
- Each product displays: product image, business name, category, and WhatsApp contact link
- **WhatsApp Contact Integration**: Contact information ("Hubungi Selanjutnya") is displayed as clickable WhatsApp link that automatically formats phone numbers and opens in new tab using `https://wa.me/<normalized_number>` pattern
- WhatsApp links include "Mulai Chat" text or WhatsApp icon for user clarity
- Link styling uses blue accent color consistent with website theme and includes underline on hover
- Product section styled consistently with site's soft blue theme

### About Us Section
- Community mission and vision
- Information about UMKM support programs
- Team or leadership information
- Contact details
- Styled with soft blue background theme

### News/Articles Section
- Community news and updates
- Articles related to UMKM development
- Success stories from members
- Industry insights and tips
- Harmonized with soft blue color scheme

### Photo Gallery
- Visual showcase of community activities
- Event photos and member highlights
- Organized by categories or events
- Soft blue themed layout

### Edukasi (Education) Section
- Educational articles and materials for UMKM development
- Business tips and tutorials
- Training resources and guides
- Learning materials organized by topics
- Styled with soft blue background theme consistent with site design

### Produk Anggota (Member Products)
- Display of member products and businesses
- Admin management interface for adding and managing member products
- **WhatsApp Contact Integration**: Contact information ("Hubungi Selanjutnya") is displayed as clickable WhatsApp link that automatically formats phone numbers and opens in new tab using `https://wa.me/<normalized_number>` pattern
- WhatsApp links include "Mulai Chat" text or WhatsApp icon for user clarity
- Link styling uses blue accent color consistent with website theme and includes underline on hover
- Styled with soft blue background theme
- Consistent with overall website design

#### Admin Product Management
- "Tambah Produk" (Add Product) button at the top of the member products list
- Product creation form with the following fields:
  - **Upload Foto**: Image upload with mandatory 1:1 (square) aspect ratio validation, file size validation, and image preview before publication
  - **Kategori**: Dropdown selection with options: Kuliner, Kriya, Jasa, Lain-lain
  - **Nama Usaha**: Required text input field for business name
  - **Hubungi Selanjutnya**: Optional text input field for contact information (phone numbers for WhatsApp integration)
- Clear error message displayed when uploaded image does not meet 1:1 aspect ratio requirement
- "Publikasikan" (Publish) button below the form to save and add new products to the list
- Form styling consistent with soft blue theme and responsive design
- Integrated seamlessly within the admin panel interface
- Product grid layout maintains proportional display for 4-column layout ensuring four images fit neatly in one row

### Anggota (Members) Section
- Public page titled "Daftar Anggota Komunitas Sahabat UMKM Karawang"
- Displays list of all verified members retrieved from backend `memberProfiles` data
- Each member entry shows:
  - **Nama**: Member's full name
  - **Nama Usaha**: Business name
  - **Kategori**: Business category
- Search bar at the top of the page allowing users to filter members dynamically
- Search functionality filters based on Nama, Kategori, or Nama Usaha fields
- Real-time search results update as user types
- Responsive grid or list layout that adapts to different screen sizes
- Styled consistently with soft blue theme and overall website design
- Clean, organized presentation of member information

### Kirim Produk UMKM (Public Product Submission)
- Public page accessible to all users for submitting product proposals
- Form titled "Kirim Produk UMKM" with the following fields:
  - **Upload Foto Produk**: Image upload with mandatory 1:1 aspect ratio validation and automatic center crop functionality
  - **Kategori**: Dropdown selection with options: Kuliner, Kriya, Jasa, Lain-lain
  - **Nama Usaha**: Required text input field for business name
  - **Hubungi Selanjutnya**: Optional text input field for contact information (phone numbers for WhatsApp integration)
- **Enhanced form submission functionality**:
  - "Kirim Pengajuan Produk" button properly calls backend function `addPengajuanProduk()` with all form data
  - Button is disabled during submission to prevent duplicate submissions
  - Loading indicator displays during backend processing
  - Success message in Indonesian appears after successful submission: "Pengajuan produk berhasil dikirim!"
  - Error messages in Indonesian for failed submissions: "Gagal mengirim pengajuan. Silakan coba lagi."
  - Automatic reconnection attempts if backend call fails due to network or canister initialization issues
  - Form resets after successful submission
- **Optimized Image Compression**:
  - Client-side image compression using medium-quality settings for files exceeding 2 MB before upload
  - Compression balances visual clarity and file size reduction to stay below 2 MB limit
  - Maintains image sharpness without noticeable quality loss
  - Loading indicator displays "Mengompres gambar..." during compression process
  - Compression occurs before the standard upload process and success confirmation
  - Ensures reliable submission without backend size-limit errors
- Form submission stores data temporarily in backend `produkPengajuan` structure
- Styled consistently with soft blue theme and responsive design
- Form validation and error handling for required fields and image requirements

### Kelola Pengajuan Produk (Product Submission Management)
- Admin interface accessible through "Kelola Pengajuan Produk" button in admin panel
- List view displaying all pending product submissions from `produkPengajuan` backend data
- Each submission displays:
  - Product image preview
  - Business name (Nama Usaha)
  - Category (Kategori)
  - Contact information as WhatsApp link with proper formatting
- **WhatsApp Contact Integration**: Contact information ("Hubungi Selanjutnya") is displayed as clickable WhatsApp link that automatically formats phone numbers and opens in new tab using `https://wa.me/<normalized_number>` pattern
- WhatsApp links include "Mulai Chat" text or WhatsApp icon for user clarity
- Link styling uses blue accent color consistent with website theme and includes underline on hover
- Admin action buttons for each submission:
  - **Setujui** (Approve) button: moves submission from `produkPengajuan` to main published products list
  - **Tolak** (Reject) button: deletes submission from pending list
- Approved products automatically appear in homepage "Produk Anggota" section
- Real-time updates: new submissions appear in list without page refresh
- Styled consistently with soft blue theme and other admin management pages
- Responsive design that adapts to different screen sizes

### Kelola Anggota (Member Management)
- Admin interface accessible through "Kelola Anggota" button in admin panel
- Table/list view displaying all registered members from backend memberProfiles data
- **Automatic numbering feature**: Table includes "No." column as the first column with sequential numbering starting from 1
- Numbering remains consistent when data is refreshed or sorted
- Each member entry displays:
  - **No.**: Automatic sequential number (1, 2, 3, etc.)
  - **Nama**: Member's full name
  - **Nama Usaha**: Business name
  - **Kategori**: Business category
  - **Kontak**: Contact information
  - **Alamat**: Address
  - **Nomor ID Anggota**: Member ID number (editable by admin)
  - **Status Verifikasi**: Verification status (verified/unverified)
- Admin action buttons for each member:
  - "Verifikasi" button to mark member as verified
  - "Batalkan Verifikasi" button to mark member as unverified
  - "Edit" button to open modal for editing member information
- Member edit modal includes:
  - Input field for "Nomor ID Anggota" allowing admin to manually enter or edit member ID numbers
  - All other member information fields for editing
  - "Simpan" (Save) button to update member data
  - "Batal" (Cancel) button to close modal without saving
- Real-time updates: new member registrations automatically appear in the list without page refresh
- Responsive table design that adapts to different screen sizes
- Styled consistently with soft blue theme and other admin management pages
- Matching typography and layout with existing admin interfaces

### Kelola Konten Edukasi (Educational Content Management)
- Admin interface accessible through "Kelola Konten Edukasi" button in admin panel
- **Enhanced category-based navigation**: Admin panel displays education category menu with the following options:
  1. Marketing
  2. Branding
  3. Selling
  4. Manajemen Produksi
  5. Desain
  6. Manajemen Keuangan
  7. Lain-lain
- Each category links to filtered view of educational content specific to that category
- Category menu styled consistently with admin panel theme using soft blue color scheme
- Responsive layout that adapts to different screen sizes
- Category buttons maintain consistent styling with other admin interface elements
- Filtered views display only educational content matching the selected category
- Educational content management interface with options to add, edit, and delete educational materials
- Content creation and editing forms include category selection dropdown matching the seven categories
- All educational content is tagged with appropriate categories for proper filtering
- Styled consistently with soft blue theme and other admin management pages

### Registration/Join Us Page
- Membership application form with soft blue styling
- Required information for new members:
  - Personal details
  - Business information
  - Contact details
- Form submission and confirmation
- Submitted data automatically appears in admin "Kelola Anggota" interface

### Admin System
- Hidden keyboard shortcut (`Ctrl + Shift + A`) that toggles visibility of admin login panel
- Admin login panel appears as modal/overlay with username and password fields
- **Enhanced admin login functionality**:
  - "Aktifkan Sesi Admin" button properly calls backend API `startAdminSession()` with credentials
  - Button is disabled during authentication to prevent multiple attempts
  - Loading indicator displays during backend processing
  - Success feedback updates admin session state and activates admin panel UI
  - Error messages in Indonesian for failed login attempts: "Login gagal. Periksa username dan password."
  - Automatic reconnection attempts if backend call fails due to network or canister initialization issues
  - Modal closes automatically after successful authentication
- Shortcut works globally across all pages
- Admin dashboard menu becomes visible after successful login
- Admin logout functionality that properly terminates sessions and hides admin controls
- Admin controls for managing content and members
- Educational content management interface with category-based filtering and navigation
- Member product management interface with add, edit, and delete capabilities
- Member management interface with verification controls and member ID editing functionality
- Product submission management interface with approve and reject capabilities
- All admin interface text in Indonesian language
- **Robust backend connection handling**: Admin authentication system includes reliable retry mechanism for temporary backend connection failures
- **Stable canister communication**: Frontend properly validates and uses correct backend canister ID for all API calls
- **Resilient admin login**: Admin login modal handles connection errors gracefully with automatic retry attempts and clear error messaging in Indonesian
- **Session recovery**: Admin panel activation works reliably after backend recovery without requiring page reloads
- **Connection error handling**: System displays appropriate Indonesian error messages for connection issues and provides retry options

## Navigation & Layout
- Main navigation bar with sections: Home, About Us, News/Articles, Photo Gallery, Edukasi, Produk Anggota, Anggota, Kirim Produk UMKM, Registration/Join Us
- Header displays the `logo flat SU BPC Karawang png.png` logo with appropriate sizing and padding
- No "Masuk" (Login) button in the top header - removed to maintain clean layout
- Navigation styled with soft blue theme and remains visually balanced
- Footer with contact information, social media links, and navigation links including Edukasi and Kirim Produk UMKM, harmonized with color scheme
- Footer displays the `logo flat SU BPC Karawang png.png` logo with appropriate sizing and contrast
- Mobile-responsive design with logo scaling appropriately for different screen sizes
- Clean, modern styling consistent with soft blue palette and logo design
- Text, buttons, and accents maintain good contrast against backgrounds
- Admin dashboard menu appears only when admin is logged in
- Admin panel at top of page adjusts layout responsively without breaking existing design

## WhatsApp Integration
- **Automatic Phone Number Formatting**: All contact information fields ("Hubungi Selanjutnya") are automatically converted to clickable WhatsApp links
- **URL Pattern**: Uses `https://wa.me/<normalized_number>` format for WhatsApp links
- **Number Normalization**: Handles both local Indonesian and international phone number formats automatically
- **Link Presentation**: Displays "Mulai Chat" text or WhatsApp icon alongside the link for user clarity
- **Styling**: WhatsApp links use blue accent color consistent with website theme and include underline on hover effect
- **New Tab Opening**: All WhatsApp links open in new browser tab for better user experience
- **Universal Application**: WhatsApp integration applies to all product listings across homepage, member products page, and admin product management interfaces

## Backend Data Storage
- Member profiles and business information with verification status and member ID numbers
- News articles and content
- Educational articles and materials with titles, content, categories, and optional images
- Photo gallery images and metadata
- Member products with images, categories, business names, and contact information
- Product submissions (`produkPengajuan`) with images, categories, business names, and contact information stored temporarily
- Registration applications
- Admin credentials and authentication data

## Backend Operations
- Create and manage member profiles with verification status tracking and member ID number storage
- Update member ID numbers manually through admin interface
- Publish and manage news articles
- Create, edit, and delete educational content items with category assignment and filtering
- Retrieve educational content filtered by specific categories (Marketing, Branding, Selling, Manajemen Produksi, Desain, Manajemen Keuangan, Lain-lain)
- Create, edit, and delete member products with image upload and validation
- Handle membership registration submissions
- Manage photo gallery content
- Update member verification status (verify/unverify members)
- Retrieve all member profiles for admin management interface
- Retrieve verified member profiles for public Anggota page display
- **Enhanced product submission handling**:
  - `addPengajuanProduk()` function processes public product submissions with image upload, category, business name, and contact information
  - Function validates all required fields and image format requirements
  - Returns success/error status for frontend feedback
  - Handles connection retries and error recovery for network issues
- Retrieve all pending product submissions for admin review
- Approve product submissions: move from `produkPengajuan` to published products
- Reject product submissions: delete from `produkPengajuan` structure
- **Enhanced admin authentication**:
  - `startAdminSession()` function authenticates admin credentials and creates active session
  - Function returns session status and authentication result for frontend state management
  - Handles connection retries and provides stable authentication responses
  - Manages session tokens and permissions properly
- **Stable session management**: Manage admin sessions and permissions with proper error recovery and connection validation
- **Graceful connection handling**: Handle temporary connection failures and provide stable API responses for frontend retry mechanisms
- Handle admin logout and session termination
- Retrieve and serve published member products for homepage display
- Validate and process product image uploads with aspect ratio and size constraints for both admin and public submissions
- **Backend health monitoring**: Provide reliable endpoint responses for frontend connection validation and retry logic
