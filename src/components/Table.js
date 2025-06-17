const Table = ({data}) => {
  
  if (!data || data.length === 0) return <p>No data available</p>;
  console.log(data)
  return (<table border="1" style={{ borderCollapse: 'collapse', width: '100%' }}>
    <thead>
      <tr>
        {data[0].map((cell, index) => (
          <th key={index} style={{ padding: '8px', background: '#f0f0f0' }}>
            {cell}
          </th>
        ))}
      </tr>
    </thead>
    <tbody>
      {data.slice(1).map((row, rowIndex) => (
        <tr key={rowIndex}>
          {row.map((cell, colIndex) => (
            <td key={colIndex} style={{ padding: '6px' }}>
              {
                data[0][colIndex] ==="Product URL"? <a href={cell}>go to</a>: data[0][colIndex] === "Image URL"? <img src={cell} style={{width: '40px', height: '40px'}}/>:cell
              }
              
            </td>
          ))}
        </tr>
      ))}
    </tbody>
  </table>)
}

export default Table;