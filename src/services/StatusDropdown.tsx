import { useState, useRef, useEffect } from 'react';

interface StatusDropdownProps {
    value: string;
    onChange: (value: string) => void;
    options: string[];
}

const StatusDropdown = ({ value, onChange, options }: StatusDropdownProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className='relative' ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className='w-full text-left px-4 py-2 bg-white dark:bg-dark-secondary rounded-md border border-[#828FA3] dark:border-gray-dark text-[#828FA3] dark:text-white hover:border-primary transition-colors flex items-center justify-between'>
                <span>{value}</span>
                <svg
                    className={`w-3 h-3 transform transition-transform ${
                        isOpen ? 'rotate-180' : ''
                    }`}
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'>
                    <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M19 9l-7 7-7-7'
                    />
                </svg>
            </button>
            {isOpen && (
                <div className='absolute top-full left-0 right-0 mt-2 bg-white dark:bg-dark-secondary rounded-lg shadow-lg z-[100]'>
                    {options.map((option) => (
                        <button
                            key={option}
                            onClick={() => {
                                onChange(option);
                                setIsOpen(false);
                            }}
                            className='w-full text-left px-4 py-2 text-[#828FA3] dark:text-white hover:bg-[#F4F7FD] dark:hover:bg-[#20212C] transition-colors first:rounded-t-lg last:rounded-b-lg'>
                            {option}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default StatusDropdown;
