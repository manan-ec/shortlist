"use client";
import Link from 'next/link';

export default function HomePage() {
    return (
        <div className="homeContainer">
            <h1 className="homeTitle">Shortlist Renders</h1>
            <nav>
                <ul className="homeNavList">
                    <li className="homeNavItem">
                        <Link href="/thumbnails">Stage 1: Thumbnails</Link>
                    </li>
                    <li className="homeNavItem">
                        <Link href="/renders">Stage 2: Full Images</Link>
                    </li>
                </ul>
            </nav>
        </div>
    );
}
