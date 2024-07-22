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
import { FaCirclePlus } from "react-icons/fa6";
import { MdOutlineMailOutline } from "react-icons/md";
import { PiMailboxBold } from "react-icons/pi";
import { MdMarkEmailRead } from "react-icons/md";
import { CgMailForward } from "react-icons/cg";
import { SiGoogleads } from "react-icons/si";
import { LuDatabaseBackup } from "react-icons/lu";
import { TbArrowBackUp } from "react-icons/tb";
import { PiStandardDefinitionLight } from "react-icons/pi";
import { RiInformation2Line } from "react-icons/ri";
import { FaCheck } from "react-icons/fa";
import { VscGitStashApply } from "react-icons/vsc";
import axios from '../../utils/axios';

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
        label: 'Link Id',
    },
    {
        id: 'imgUrl',
        label: 'Logo',
    },
    {
        id: 'linkUrl',
        label: 'Link Url',
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

export default function ViewEmails() {
    const navigate = useNavigate()
    const [order, setOrder] = React.useState('asc');
    const [orderBy, setOrderBy] = React.useState('calories');
    const [selected, setSelected] = React.useState([]);
    const [smtpbuliderLogs, setsmtpbuliderLogs] = React.useState([]);
    const [mailWarmerLogs, setMailWarmerLogs] = React.useState([]);
    const [uniBoxLogs, setUniBoxLogs] = React.useState([]);
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const [rows, setRows] = React.useState([]);
    const [res, setRes] = React.useState([]);
    const [modal, setModal] = React.useState(false);

    const logos = [
        <FaCheck className='h-10 w-10 text-[#539BFF]' />,
        <PiStandardDefinitionLight className='h-10 w-10 text-[#539BFF]' />,
        <LuDatabaseBackup className='h-10 w-10 text-[#539BFF]' />,
        <PiMailboxBold className='h-10 w-10 text-[#539BFF]' />,
        <MdMarkEmailRead className='h-10 w-10 text-[#539BFF]' />,
        <PiStandardDefinitionLight className='h-10 w-10 text-[#539BFF]' />,
        <MdOutlineMailOutline className='h-10 w-10 text-[#539BFF]' />,
        <CgMailForward className='h-10 w-10 text-[#539BFF]' />,
        <PiMailboxBold className='h-10 w-10 text-[#539BFF]' />,
        <SiGoogleads className='h-10 w-10 text-[#539BFF]' />,
        <TbArrowBackUp className='h-10 w-10 text-[#539BFF]' />,
        <RiInformation2Line className='h-10 w-10 text-[#539BFF]' />,
        <VscGitStashApply className='h-10 w-10 text-[#539BFF]' />
    ]

    const logKeys = [
        ["Number of emails:"],
        ["Total mailing accounts:", "Total domains:", "Secure SMTP port:"],
        ["Number of platforms:"],
        ["Total inbox count:", "Total active accounts:", "Total inactive accounts:"],
        ["Total mails processed:", "Total mails failed:", "Total sent mail:"],
        ["Total mailing accounts:", "Total domains:", "Secure SMTP port:"],
        ["Total mailing accounts:", "Total domains:", "Secure SMTP port:"],
        ["Number of forwarded emails:"],
        ["Total inbox count:", "Total active accounts:", "Total inactive accounts:"],
        ["Total mailing accounts:", "Total domains:", "Secure SMTP port:"],
        ["Total mailing accounts:", "Total domains:", "Secure SMTP port:"],
        ["Total mailing accounts:", "Total domains:", "Secure SMTP port:"],
        ["Total mailing accounts:", "Total domains:", "Secure SMTP port:"],
    ]

    const logs = [
        [300],
        smtpbuliderLogs,
        [7],
        uniBoxLogs,
        mailWarmerLogs,
        smtpbuliderLogs,
        smtpbuliderLogs,
        [100],
        uniBoxLogs,
        smtpbuliderLogs,
        smtpbuliderLogs,
        smtpbuliderLogs,
        smtpbuliderLogs,
    ]

    const handleChangeRowsPerPage = (event) => {
        var num = Number(event?.target?.value) || event;
        setRowsPerPage(num);
        setPage(0);
    };

    async function openLink(ev, url) {
        ev.preventDefault();
        if (url) {
            window.open(url, '_blank').focus();
        }
    }

    async function smtpbuliderLogsFunc() {
        try {
            await axios.get("http://vmi2000569.contaboserver.net:4000/api/smtpBuilderLogs").then(res => {
                setsmtpbuliderLogs([res.data.mailingAcc, res.data.domains, res.data.sslPort])
            })
        }
        catch (e) {

        }
    }

    async function mailWarmerLogsFunc() {
        try {
            await axios.get("https://mailwarmer.onrender.com/logs/log-stats").then(res => {
                setMailWarmerLogs([res.data.TotalMailsProcessed, res.data.TotalMailsFailed, res.data.TotalSentMail])
            })
        }
        catch (e) {

        }
    }

    async function uniBoxLogsFunc() {
        try {
            await axios.get("https://sea-turtle-app-m6etq.ondigitalocean.app/api/logs").then(res => {
                setUniBoxLogs([res.data.inbox.count, res.data.accounts.activeAccounts, res.data.accounts.inactiveAccounts])
            })
        }
        catch (e) {

        }
    }

    async function fetchData() {
        try {
            var resArr = [];

            await axios.get("http://vmi2000569.contaboserver.net:4000/api/links").then(res => {
                res?.data?.forEach((item, index) => {
                    resArr.push({ id: index + 1, linkUrl: item.linkUrl, name: item?.name })
                });
            })

            setRows(resArr);
            handleChangeRowsPerPage(5)
        }
        catch (e) {

        }
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

    async function openAll(ev) {
        ev.preventDefault();
        let links = [];
        try {
            await axios.get("http://vmi2000569.contaboserver.net:4000/api/links").then(res => {
                links = res?.data;
            })
            for (let i = 0; i < links.length; i++) {
                setTimeout(() => {
                    const a = document.createElement('a');

                    a.style.display = 'none';
                    a.href = links[i].linkUrl;
                    a.target = '_blank';
                    document.body.appendChild(a);

                    a.click();
                    a.remove();
                }, i * 1250);
            }
        }

        catch (e) {

        }
    }


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
        fetchData();
        smtpbuliderLogsFunc();
        mailWarmerLogsFunc();
        uniBoxLogsFunc();
    }, [])

    if (res === 200) { navigate(0); setRes(0) }

    return (
        <Box sx={{ width: '100%' }}>

            <div className="grid grid-flow-row grid-cols-4 items-center justify-center gap-4 w-full h-full">
                {
                    rows?.map((row, index) => (
                        <div className="card h-[200px] flex flex-col justify-center bg-[#09141a] items-center rounded-xl gap-2" key={index} >
                            <h1 className="font-bold text-xl">{row?.name}</h1>
                            {logos[index]}
                            <div className="flex-col gap-1 flex">
                                {logKeys[index]?.map((item, i) => {
                                    return (
                                        <div className='flex gap-1'>
                                            <h5 className="">{item}</h5>
                                            <h4 className="font-black text-[#539BFF]">{logs[index][i]}</h4>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    ))
                }
            </div>

            <Paper sx={{ width: '100%', mb: 2, mt: 2 }}>
                {/* <EnhancedTableToolbar numSelected={selected.length} /> */}
                <div className='flex justify-between items-center h-20 px-4'>
                    <Typography
                        sx={{ flex: '1 1 100%' }}
                        variant="h2"
                        id="tableTitle"
                        component="div"
                    >
                        Smtp Emails
                    </Typography>
                    <div className="flex gap-4">
                        <button
                            className='text-white bg-[#142733] flex justify-center items-center text-xl gap-4 border w-[180px] rounded-md border-transparent px-4 py-2'
                            onClick={(ev) => {
                                setModal(!modal)
                            }}>
                            Open Logs
                        </button>
                        <button
                            className='text-white bg-[#142733] flex justify-center items-center text-xl gap-4 border w-[180px] rounded-md border-transparent px-4 py-2'
                            onClick={(ev) => {
                                openAll(ev)
                            }}>
                            Open All
                            <FaCirclePlus />
                        </button>
                    </div>
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
                                        <TableCell>
                                            {logos[index]}
                                        </TableCell>
                                        <TableCell>{row.linkUrl}</TableCell>
                                        <TableCell>
                                            <button
                                                className='text-white bg-[#142733] flex justify-center items-center text-xl gap-4 border rounded-md border-transparent px-4 py-2'
                                                onClick={(ev) => {
                                                    openLink(ev, row.linkUrl)
                                                }}>
                                                Open
                                                <FaCirclePlus />
                                            </button>
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