import { forwardRef } from 'react';

const Table = forwardRef(({
    headers = [],
    data = [],
    pill = false,
    className = ''
}, ref) => {

    return (
        <table>
            <tr>
                {Array.isArray(headers) && headers.map((header) => (
                    <th>{header}</th>
                ))}
            </tr>
            {Array.isArray(data) && data.map((dato) => (
                <tr>
                    <td>{dato['descrizione']}</td>
                    <td>{dato['oreaula']}</td>
                    <td>{dato['oreproject']}</td>
                    <td>{dato['orestage']}</td>
                    <td>{dato['oreelearn']}</td>
                </tr>
            ))}
        </table>
    );
});

export default Table;