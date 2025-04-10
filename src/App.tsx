import { useState } from 'react';
import { Toaster } from 'react-hot-toast';
import Sidebar from './components/Sidebar';
import Content from './components/Content';
import Header from './components/Header';
import CreateBoardModal from './components/CreateBoardModal';

export default function App() {
    const [showSidebar, setShowSidebar] = useState(true);
    const [showCreateBoard, setShowCreateBoard] = useState(false);

    return (
        <div className='relative dark:bg-dark-secondary bg-soft-light'>
            <Header />
         
                <Sidebar
                    onHide={() => setShowSidebar(false)}
                    show={showSidebar}
                    onCreateBoard={() => setShowCreateBoard(true)}
                />

                <div>
                    <Content
                        onShow={() => setShowSidebar(true)}
                        show={showSidebar}
                    />
                </div>
   
            {showCreateBoard && (
                <CreateBoardModal onClose={() => setShowCreateBoard(false)} />
            )}
            <Toaster
                toastOptions={{
                    duration: 3000,
                    success: {
                        style: {
                            background: '#22C55E',
                            color: '#fff',
                        },
                    },
                    error: {
                        style: {
                            background: '#EF4444',
                            color: '#fff',
                        },
                    },
                }}
            />
        </div>
    );
}
