import { useState } from 'react';
import Content from './components/Content';
import Header from './components/Header';
import Sidebar from './components/Sidebar';

export default function App() {
    const [showSidebar, setShowSidebar] = useState(true);

    return (
        <div className='relative'>
            <Header />
            <div className='flex'>
                <Sidebar
                    onHide={() => setShowSidebar(false)}
                    show={showSidebar}
                />
                <Content
                    onShow={() => setShowSidebar(true)}
                    show={showSidebar}
                />
            </div>
        </div>
    );
}
