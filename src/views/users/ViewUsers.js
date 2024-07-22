/* eslint-disable no-restricted-globals */
/* eslint-disable no-loop-func */
import * as React from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import { visuallyHidden } from '@mui/utils';
import { useNavigate } from 'react-router'
import axios from '../../utils/axios';
import { FaPen } from "react-icons/fa";
import { FaTrashAlt } from "react-icons/fa";


function descendingComparator(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
        return -1;
    }
    if (b[orderBy] > a[orderBy]) {
        return 1;
    }
    return 0;
}

function getComparator(order, orderBy) {
    return order === 'desc'
        ? (a, b) => descendingComparator(a, b, orderBy)
        : (a, b) => -descendingComparator(a, b, orderBy);
}
function stableSort(array, comparator) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) {
            return order;
        }
        return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
}

const headCells = [
    {
        id: 'id',
        label: 'User Id',
    },
    {
        id: 'username',
        label: "User's Name",
    },
    {
        id: 'actions',
        label: 'Actions',
    },
];

function EnhancedTableHead(props) {
    const { order, orderBy, onRequestSort } =
        props;
    const createSortHandler = (property) => (event) => {
        onRequestSort(event, property);
    };

    return (
        <TableHead>
            <TableRow>
                {headCells.map((headCell) => (
                    <TableCell
                        key={headCell.id}
                        align={headCell.numeric ? 'right' : 'left'}
                        padding={headCell.disablePadding ? 'none' : 'normal'}
                        sortDirection={orderBy === headCell.id ? order : false}
                    >
                        <TableSortLabel
                            active={orderBy === headCell.id}
                            direction={orderBy === headCell.id ? order : 'asc'}
                            onClick={createSortHandler(headCell.id)}
                        >
                            {headCell.label}
                            {orderBy === headCell.id ? (
                                <Box component="span" sx={visuallyHidden}>
                                    {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                </Box>
                            ) : null}
                        </TableSortLabel>
                    </TableCell>
                ))}
            </TableRow>
        </TableHead>
    );
}

EnhancedTableHead.propTypes = {
    numSelected: PropTypes.number.isRequired,
    onRequestSort: PropTypes.func.isRequired,
    onSelectAllClick: PropTypes.func.isRequired,
    order: PropTypes.oneOf(['asc', 'desc']).isRequired,
    orderBy: PropTypes.string.isRequired,
    rowCount: PropTypes.number.isRequired,
};

export default function ViewUsers() {
    const navigate = useNavigate()
    const [order, setOrder] = React.useState('asc');
    const [orderBy, setOrderBy] = React.useState('calories');
    const [selected, setSelected] = React.useState([]);
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const [rows, setRows] = React.useState([])
    const [res, setRes] = React.useState([])

    const handleChangeRowsPerPage = (event) => {
        var num = Number(event?.target?.value) || event;
        setRowsPerPage(num);
        setPage(0);
    };

    // async function openLink(ev, url) {
    //     ev.preventDefault();
    //     if (url) {
    //         window.open(url, '_blank').focus();
    //     }
    // }

    async function deleteUser(ev, data) {
        ev.preventDefault();
        await axios.post("http://vmi2000569.contaboserver.net:4000/api/delUser", { username: data.username, links: data.links }).then(res => {
            location.reload()
        })
    }


    async function fetchData() {
        try {
            var resArr = [];

            await axios.get("http://vmi2000569.contaboserver.net:4000/api/users").then(res => {
                res?.data?.forEach((item, index) => {
                    resArr.push({ id: index + 1, username: item.username, links: item.links })
                });
            })

            setRows(resArr);
            handleChangeRowsPerPage(10)
        }
        catch (e) { }
    }

    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleSelectAllClick = (event) => {
        if (event.target.checked) {
            const newSelected = rows.map((n) => n.id);
            setSelected(newSelected);
            return;
        }
        setSelected([]);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    // Avoid a layout jump when reaching the last page with empty rows.
    const emptyRows =
        page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

    var visibleRows = React.useMemo(
        () =>
            stableSort(rows, getComparator(order, orderBy)).slice(
                page * rowsPerPage,
                page * rowsPerPage + rowsPerPage,
            ),
        [order, orderBy, page, rowsPerPage],
    );

    React.useEffect(() => {
        fetchData()
    }, [])

    if (res === 200) { navigate(0); setRes(0) }

    return (
        <Box sx={{ width: '100%' }}>
            <Paper sx={{ width: '100%', mb: 2, mt: 2 }}>
                {/* <EnhancedTableToolbar numSelected={selected.length} /> */}
                <div className='flex justify-between items-center h-20 px-4'>
                    <Typography
                        sx={{ flex: '1 1 100%' }}
                        variant="h2"
                        id="tableTitle"
                        component="div"
                    >
                        Users
                    </Typography>
                </div>
                <TableContainer>
                    <Table
                        sx={{ minWidth: 750 }}
                        aria-labelledby="tableTitle"
                        size='medium'
                    >
                        <EnhancedTableHead
                            numSelected={selected.length}
                            order={order}
                            orderBy={orderBy}
                            onSelectAllClick={handleSelectAllClick}
                            onRequestSort={handleRequestSort}
                            rowCount={rows.length}
                        />
                        <TableBody>
                            {visibleRows.map((row, index) => {

                                return (
                                    <TableRow
                                        tabIndex={-1}
                                        key={row.id}
                                    >
                                        <TableCell
                                            component="th"
                                            scope="row"
                                        >
                                            {row.id}
                                        </TableCell>
                                        <TableCell>{row.username}</TableCell>
                                        <TableCell>
                                            <div className="flex gap-2 items-center">
                                                {/* <FaPen className='w-5 h-5 cursor-pointer text-blue-600' onClick={(ev) => {
                                                    openLink(ev, row.username)
                                                }} /> */}
                                                <FaTrashAlt className='w-5 h-5 cursor-pointer text-red-600' onClick={(ev) => { deleteUser(ev, row) }} />
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                            {emptyRows > 0 && (
                                <TableRow
                                    style={{
                                        height: 53 * emptyRows,
                                    }}
                                >
                                    <TableCell colSpan={6} />
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={rows.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </Paper>
        </Box>
    );

}