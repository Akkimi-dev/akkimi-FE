import React from 'react';
import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav className="bg-white shadow px-4 py-2 flex justify-between items-center">
      <span className="text-xl font-bold">Akkimi</span>
      <ul className="flex gap-4 list-none">
        <li><Link to="/">홈</Link></li>
        <li><Link to="/calendar">캘린더</Link></li>
        <li><Link to="/survey">설문조사</Link></li>
        <li><Link to="/settings">설정</Link></li>
        <li><Link to="/support">지원</Link></li>
      </ul>
    </nav>
  );
}
