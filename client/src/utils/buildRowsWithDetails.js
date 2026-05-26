export const buildRowsWithDetails = ({
    rows,
    expandedRows,
    buildDetailRow
}) => {

    const finalRows = [];

    rows.forEach((row) => {

        finalRows.push(row);

        if (expandedRows.includes(row.id)) {

            const detailRow = buildDetailRow(row);

            finalRows.push({
                ...detailRow,

                sortable: false,
                filterable: false
            });
        }
    });

    return finalRows;
};