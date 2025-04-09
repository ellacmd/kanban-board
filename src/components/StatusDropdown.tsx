import { Fragment } from 'react';
import { Listbox, Transition } from '@headlessui/react';

interface StatusDropdownProps {
    value: string;
    onChange: (value: string) => void;
    options: string[];
}

const StatusDropdown = ({ value, onChange, options }: StatusDropdownProps) => {
    return (
        <Listbox value={value} onChange={onChange}>
            <div className='relative'>
                <Listbox.Button
                    className='relative w-full p-2 text-left border border-gray-light dark:border-gray-medium rounded-md 
                                         dark:bg-gray-dark dark:text-white hover:border-primary transition-colors
                                         flex items-center justify-between'>
                    <span className='block truncate'>{value}</span>
                    <span className='pointer-events-none flex items-center'>
                        <svg
                            className='w-4 h-4'
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
                    </span>
                </Listbox.Button>
                <Transition
                    as={Fragment}
                    leave='transition ease-in duration-100'
                    leaveFrom='opacity-100'
                    leaveTo='opacity-0'>
                    <Listbox.Options
                        className='absolute z-50 w-full mt-1 max-h-60 overflow-auto rounded-md bg-white dark:bg-gray-dark 
                                              py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm'>
                        {options.map((option) => (
                            <Listbox.Option
                                key={option}
                                className={({ active }) =>
                                    `relative cursor-pointer select-none py-2 pl-4 pr-4 ${
                                        active
                                            ? 'bg-soft-light dark:bg-gray-medium'
                                            : 'text-gray-light dark:text-white'
                                    } ${option === value ? 'text-primary' : ''}`
                                }
                                value={option}>
                                {({ selected }) => (
                                    <span
                                        className={`block truncate ${
                                            selected
                                                ? 'font-medium'
                                                : 'font-normal'
                                        }`}>
                                        {option}
                                    </span>
                                )}
                            </Listbox.Option>
                        ))}
                    </Listbox.Options>
                </Transition>
            </div>
        </Listbox>
    );
};

export default StatusDropdown;
