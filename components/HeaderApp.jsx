'use client';

import React from 'react';
import Link from 'next/link';

const HeaderApp = () => {
  return (
    <nav className='flex items-center justify-start px-8 py-4 bg-white border-b-2 border-gray-200 shadow-sm'>
      <Link href={"/"} className="flex items-center font-bold text-xl text-gray-900 mr-12">
        🛡️ NFT 检测系统
      </Link>
      <ul className='flex items-center space-x-8'>
        <li>
          <Link href={"/statics"} className='hover:text-blue-600 text-gray-700 font-medium transition-colors'>
            数据概览
          </Link>
        </li>
        <li>
          <Link href="/detect" className='hover:text-blue-600 text-gray-700 font-medium transition-colors'>
            侵权检测
          </Link>
        </li>
        <li>
          <Link href="/register" className='hover:text-blue-600 text-gray-700 font-medium transition-colors'>
            正版登记
          </Link>
        </li>
      </ul>
    </nav>
  );
};
export default HeaderApp;