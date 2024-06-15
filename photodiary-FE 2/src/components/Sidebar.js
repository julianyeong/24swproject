import React from 'react';

function Sidebar() {
  return (
    <section id="sidebar">
      <section id="intro">
        <header>
          <h2>Photo Diary</h2>
        </header>
      </section>
      <section>
        <div className="mini-posts">
          {/* 미니 포스트를 여기에 렌더링 */}
        </div>
      </section>
      <section>
        <ul className="posts">
          {/* 포스트 리스트를 여기에 렌더링 */}
        </ul>
      </section>
    </section>
  );
}

export default Sidebar;
