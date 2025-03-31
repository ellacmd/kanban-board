import Card from './Card';

const Column = () => {
    return (
        <div >
            <div className='flex items-center gap-4 text-gray-light text-sm mb-8 font-semibold '>
                <span className='w-4 h-4 rounded-full bg-primary-light inline-block'></span>
                <h3>TODO &nbsp; ( 4 )</h3>
            </div>

            <div className='flex flex-col gap-4'>
                <Card />
                <Card />
                <Card />
                <Card />
                <Card />
                <Card />
            </div>
                
        </div>
    );
};

export default Column;
