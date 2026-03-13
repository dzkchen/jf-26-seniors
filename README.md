# JF-26-Seniors

![Next.js](https://img.shields.io/badge/next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Firebase](https://img.shields.io/badge/firebase-%23039BE5.svg?style=for-the-badge&logo=firebase)
![Chart.js](https://img.shields.io/badge/chart.js-F5788D.svg?style=for-the-badge&logo=chart.js&logoColor=white)

The Unofficial Official Class Profile of the Fraser 26' Grads!

## About This Project
Throughout our years here, we’ve learned to balance classes with extracurriculars and responsibilities. We’ve made many friends, taken on leadership roles, and created memories that define our high school experience. The goal of this is to be a way we can look back on our high school life after graduation and a memento of what made our class so great. Furthermore, it will be a great way for John Fraser to understand Senior Life! This is one small way of celebrating that journey and the people who made the Class of 2026 what it is. Good luck on your future endeavors to all.

Go Jags!

## Personal Statement
A personal project of mine to learn frontend web dev. All data will obtained from a form released in May; which will be compiled to be visualized through the website. Feel free to reach out to me on instagram @zkc.david if you have any questions, concerns or inquiries!

## Mission
A personal project of mine to learn web dev. Feel free to reach out to me on instagram @zkc.david if you have any questions, concerns or want to help contribute!

## Features & Architecture

* **Data Collection**
    * **Protected Survey:** A multi-step form built with `react-hook-form` and `zod` validation.
    * **Authentication:** Firebase Auth restricts access to a pre-approved whitelist of `@pdsb.net` student emails to ensure data integrity (only Grade 12 students from Fraser can submit this form!)
* **User Experience**
    * **Class Profile:** Aggregated, anonymized statistics (demographics, academics, lifestyle habits) visualized using Chart.js.
    * **Stay Connected Directory:** A searchable, filterable grid of graduate profiles featuring their post-secondary plans and social links. Optimized with Next.js Incremental Static Regeneration (ISR).
    * **The Rewind:** A chronological, scrollable timeline of our senior year featuring milestone events and media, animated with Framer Motion.
    * **Admin Dashboard:** A hidden moderation route for me to review and approve public profiles.

## Acknowledgements
Inspired by the many class profiles of Waterloo Engineering cohorts. 
My primary inspiration to start this project:
 - [SYDE '27 Class Profile](https://github.com/shelleychen318/syde27-class-profile/tree/main)
 - [SE '25 Class Profile](https://github.com/sexxv/classprofile)
 - [UWCS '24 Class Profile](https://github.com/uwcsc/class-profile-2024)

## Tech Stack

* **Framework:** Next.js
* **Language:** TypeScript
* **Styling:** Tailwind CSS & Shadcn UI
* **Database & Auth:** Firebase (Firestore & Auth)
* **Data Visualization:** Chart.js
* **Animations:** Framer Motion
* **Form Handling:** React Hook Form & Zod
* **Deployment:** Vercel

## Roadmap
To be filled out as the project progresses