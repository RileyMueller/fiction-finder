import React from 'react';
import Link from 'next/link'

const Dashboard = (props) => {
  return (
    <div>
      <h2>Dashboard</h2>
      <ul>
        <li><Link href="/">Home</Link></li>
        <li><Link href="/about">About</Link></li>
        <li><a href="https://github.com/RileyMueller/fiction-finder">GitHub</a></li>
      </ul>
    </div>
  );
};

export default Dashboard;
