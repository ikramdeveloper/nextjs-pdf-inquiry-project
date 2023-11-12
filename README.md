# PDF AI Inquiry Project (SAAS)

Welcome to the PDF AI Inquiry project! This Next.js (TypeScript) application empowers users to upload PDFs and seamlessly interact with AI to ask questions related to their documents. Here's a quick overview of the technologies used:

## Technologies Used:

- **Next.js App Router:** Leveraging the power of Next.js for a seamless and efficient user experience.

- **Tailwind CSS with Shadcn:** Stylishly designed using Tailwind CSS & Shadcn, ensuring an attractive and responsive UI.

- **Clerk:** Auth implementation with login/register pages using @clerk/nextjs.

- **NeonDB:** Utilizing NeonDB for efficient and reliable database management.

- **PineconeDB:** Storing AI-related data, including namespaces and metrics, to enhance the overall AI functionality.

- **OpenAI API:** Integrating OpenAI API to provide users with a sophisticated and interactive chat experience.

## Getting Started:

1. Clone the repository: `git clone [repository-url]`
2. Install dependencies: `npm install`
3. Configure NeonDB and PineconeDB credentials.
4. Set up your OpenAI API key.
5. Configure any of Cloudinary, Google Cloud Storage or S3 bucket. Use uploadToStorage function according to configuration in lib/storage.ts
6. Run the project: `npm run dev`

## Usage:

1. **Upload PDFs:** Users can easily upload their PDF documents through the intuitive interface.

2. **Ask AI Questions:** Engage with the AI functionality to ask questions related to the uploaded PDFs.

## Project Structure:

- `app/`: Contains the Next.js app for different sections of the application.
- `app/api/`: Next.js apis for different routes.
- `services/`: Write code for querying or mutating apis data with axios.
- `lib/db/`: Configurations and schemas for NeonDB.
- `lib/pinecone`: Configurations and queries for PineconeDB.
- `components/`: Reusable React components for a modular and maintainable codebase.
- `types/`: Typescript types for variables
- `config/`: Configuration values and constants to use throughout the application

## Configuration:

Make sure to update the configuration files with your specific credentials for NeonDB, PineconeDB, and the OpenAI API.

## Contributing:

Contributions are welcome! Feel free to open issues or submit pull requests to improve the project.

## Todo:

- Payment integration with Stripe

## License:

This project is licensed under the [MIT License](LICENSE.md).

Thank you for using the PDF AI Inquiry Project! If you have any questions or feedback, don't hesitate to reach out. Happy coding!
