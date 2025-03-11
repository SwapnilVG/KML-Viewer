const KMLSummary = ({ kmlData, showDetailed }) => {
  if (!kmlData) return null;

  return (
    <div className="w-full max-w-2xl mx-auto p-4">
      <div className="bg-base-200 rounded-lg p-6 shadow-lg">
        <h2 className="text-2xl font-bold mb-4">
          {showDetailed ? 'Detailed KML Analysis' : 'KML Summary'}
        </h2>
        
        {!showDetailed ? (
          <div className="overflow-x-auto">
            <table className="table w-full">
              <thead>
                <tr>
                  <th>Element Type</th>
                  <th>Count</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(kmlData.elementCounts).map(([type, count]) => (
                  <tr key={type}>
                    <td>{type}</td>
                    <td>{count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="table w-full">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Type</th>
                  <th>Length (km)</th>
                </tr>
              </thead>
              <tbody>
                {kmlData.elements.map((element, index) => (
                  <tr key={index}>
                    <td>{element.name}</td>
                    <td>{element.type}</td>
                    <td>
                      {['LineString', 'MultiLineString'].includes(element.type)
                        ? element.length
                        : 'N/A'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default KMLSummary; 