'use client';

export default function DetectLayout({ children }) {
  return (
    <div className="bg-gray-50 py-6 px-6 flex-1">
      {children}
    </div>
  );
}

