import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
    return (
        <div className="overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 p-[1px] shadow-lg">
        <div className="rounded-2xl bg-white dark:bg-gray-900">
            <div className="px-8 py-12 text-center">
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white">
                Welcome to your Job Tracker
            </h1>
            <p className="mt-3 text-gray-600 dark:text-gray-300">
                Track, filter, and analyse your job applications effortlessly.
            </p>
            <div className="mt-6">
                <Link
                to="/applications"
                className="inline-block rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 font-medium transition"
                >
                Go to Applications
                </Link>
            </div>
            </div>
        </div>
        </div>
    );
};

export default Home;
