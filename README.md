# Flashcard SRS

## Description

The Flashcard Learning App is designed to help users create, review, and manage flashcards using spaced repetition learning (SRS). Built with a Go backend and a Next.js frontend, it allows users to create flashcards, review them based on spaced repetition intervals, and track their learning progress.

## Features

-Flashcards: Create, update, and delete flashcards
-Reviews: Create, update, and delete reviews for flashcards
-Learning Plans: Manage learning plans for structured practice
-Spaced Repetition: Review flashcards with interval-based repetition (easy, medium, hard)
-Tracking Progress: Monitor learning progress through difficulty levels and review dates
-Backend: API built with Go and GORM for efficient data handling
-Frontend: Built with Next.js and styled with Tailwind CSS for a responsive UI

## Tech Stack

- **Backend**: Go, Gorilla Mux, GORM, SQLite
- **Frontend**: Next.js, Tailwind CSS
- **Database**: SQLite (for local development), can be swapped with other databases like PostgreSQL or MySQL

## Usage

1. Create flashcards through the interface or API.
2. Use the spaced repetition feature to review flashcards. Cards are categorized into easy, medium, or hard based on your responses, affecting their next review date.
3. Track your progress and optimize your learning with repeated reviews over time.
