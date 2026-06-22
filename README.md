This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

http://localhost:3000/dashboard/admin/transactions,http://localhost:3000/dashboard/admin/analytics,,,,,,ai duita page ar kaj korba .........1.ট্রানজেকশন ট্র্যাকিং (View All Transactions)
প্ল্যাটফর্মের শুরু থেকে শেষ পর্যন্ত হওয়া সমস্ত আর্থিক লেনদেন এডমিন দেখতে পাবেন। টেবিলটিতে থাকবে:

Transaction ID: প্রতিটি পেমেন্টের ইউনিক আইডি।

Type (ধরণ): পেমেন্টটি কী ধরণের ছিল তা স্পষ্ট লেখা থাকবে। যেমন—

Subscription (ইউজারদের Pro বা Premium কেনা)

Purchase / Publishing Fee (আর্টওয়ার্ক কেনা বা আর্টিস্টদের ফি)।

User/Artist Email: কে পেমেন্টটি করেছে তার ইমেইল।

Amount & Date: পেমেন্টের পরিমাণ এবং তারিখ।

2. অ্যানালিটিক্স এবং চার্ট (Analytics Overview & Charts)
   এডমিন ড্যাশবোর্ডের মূল আকর্ষণ হলো ডেটা ভিজ্যুয়ালাইজেশন বা গ্রাফিক্যাল ভিউ:

অ্যানালিটিক্স কার্ড: ড্যাশবোর্ডের উপরে ৪টি কার্ডে রিয়েল-টাইম হিসাব থাকবে:

মোট ইউজারের সংখ্যা (Total Users)

মোট আর্টিস্টের সংখ্যা (Total Artists)

মোট বিক্রি হওয়া আর্টওয়ার্কের সংখ্যা (Total Artworks Sold)

প্ল্যাটফর্মের সর্বমোট আয় (Total Revenue)

চার্ট ও গ্রাফ (Charts): ডেটা সহজে বোঝার জন্য ২টি চার্ট ইমপ্লিমেন্ট করতে হবে:

Sales Chart: একটি লাইন বা বার চার্ট যা সময়ের সাথে সাথে সেলসের গ্রোথ দেখাবে।

Artworks by Category Pie Chart: একটি পাই-চার্ট (Pie Chart) যা দেখাবে কোন ক্যাটাগরির (যেমন: Painting, Digital, Sculpture) আর্টওয়ার্ক কত শতাংশ আপলোড বা সেল হয়েছে।
