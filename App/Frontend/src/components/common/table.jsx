import { forwardRef } from 'react';

const Table = forwardRef(({
    headers = [],
    labels = [],
    data = [],
    pill = false,
    className = ''
}, ref) => {

    return (
        <div className={`border border-[#E0E6EB] bg-white rounded-[30px] w-full h-full overflow-hidden flex flex-col ${className}`}>
            <div className="overflow-y-auto">
                <table className="w-full text-left">
                    <thead className="sticky top-0 bg-white z-10">
                        <tr>
                            {Array.isArray(headers) && headers.map((header, index) => (
                                <th
                                    className={`text-${index !== 0 ? 'center' : 'left'} py-[1vh] px-[2vh] text-[#000000] font-normal text-xs`}
                                    key={index}
                                >
                                    {header}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {Array.isArray(data) && data.map((dato, index) => (
                            <tr key={index} className='border-t-2 border-[#EDEDED]'>
                                {Array.isArray(labels) && labels.map((label, labelIndex) => (
                                    <td
                                        className={`text-${labelIndex !== 0 ? 'center' : 'left'} p-[2vh] text-[#000000] font-bold text-[2vh]`}
                                        key={labelIndex}
                                    >
                                        {dato[label]}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
});

export default Table;