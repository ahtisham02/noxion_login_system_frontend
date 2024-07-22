import { Box, IconButton, Snackbar } from '@mui/material';
import { GridCloseIcon } from '@mui/x-data-grid';
import React, { Fragment, useState } from 'react'
import { Navigate, useNavigate } from 'react-router';
import { Button } from 'reactstrap';
import axios from "../../utils/axios"
import Select from '@mui/material/Select';
import Checkbox from '@mui/material/Checkbox';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import ListItemText from '@mui/material/ListItemText';

const AddUsers = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [links, setLinks] = useState([]);
    const [response, setResponse] = useState();
    const [open, setOpen] = useState(false);
    const [error, setError] = useState("");
    const [disabled, setDisabled] = useState(false);
    const [selectData, setSelectData] = useState([]);

    const navigate = useNavigate()

    function generatePass() {
        let pass = '';
        let str = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ' +
            'abcdefghijklmnopqrstuvwxyz0123456789@#$';

        for (let i = 1; i <= 8; i++) {
            let char = Math.floor(Math.random()
                * str.length + 1);

            pass += str.charAt(char)
        }

        setPassword(pass)
    }

    async function fetchData() {
        try {
            var resArr = [];

            await axios.get("http://vmi2000569.contaboserver.net:4000/api/links").then(res => {
                res?.data?.forEach((item, index) => {
                    resArr.push({ id: item._id, linkUrl: item.linkUrl, imgUrl: item?.imgUrl, name: item?.name })
                });
            })
            setSelectData(resArr);
            console.log(selectData)
        }
        catch (e) {

        }
    }

    React.useEffect(() => {
        fetchData()
    }, [])

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpen(false);
    };

    const action = (
        <Fragment>
            <IconButton
                size="small"
                aria-label="close"
                color="inherit"
                onClick={handleClose}
            >
                <GridCloseIcon fontSize="small" />
            </IconButton>
        </Fragment>
    );

    function OnLinkChange(event) {
        const {
            target: { value },
        } = event;
        setLinks(
            // On autofill we get a stringified value.
            typeof value === 'string' ? value.split(',') : value,
        );
    }

    async function addEmail(ev) {
        ev.preventDefault();
        setDisabled(true);
        try {
            await axios.post("http://vmi2000569.contaboserver.net:4000/api/addUser", {
                username, password , links
            }).then(
                res => {
                    navigate("/home")
                }
            )
            setDisabled(false)
        }
        catch (e) {
            setDisabled(false)
            throw e;
        }
    }
    if (response === 200) return (<Navigate to={"/home"} />)
    return (
        <div className="w-full h-[80vh] flex justify-center items-center">
            <Snackbar
                open={open}
                autoHideDuration={6000}
                onClose={handleClose}
                message={error}
                action={action}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            />
            <form className='h-max w-max flex flex-col items-center justify-center gap-4 bg-[#09141a] px-8 py-12 border-transparent rounded-2xl'>
                <h1 className="w-full text-start text-2xl">Add User :</h1>
                <Box className="flex items-center min-w-[500px] gap-[5%]">
                    <input
                        type="text"
                        placeholder="example"
                        value={username}
                        onChange={(ev) => { setUsername(ev.target.value) }}
                        className="w-[500px] border border-slate-200 rounded-lg py-3 px-5 outline-none bg-white text-[#09141a] h-[55px]"
                    />
                </Box>
                <Box className="flex items-center min-w-[500px] gap-[5%]">
                    <input
                        type="text"
                        placeholder="********"
                        value={password}
                        onChange={(ev) => { setPassword(ev.target.value) }}
                        className="w-[60%] border border-slate-200 rounded-lg py-3 px-5 outline-none bg-white text-[#09141a] h-[55px]"
                    />
                    <Button className='w-[35%] text-white bg-[#142733] flex justify-center items-center gap-4 border rounded-md border-transparent px-2 h-[54px]' onClick={generatePass}>Generate Password</Button>
                </Box>
                <Box className="flex items-center min-w-[500px] gap-[5%]">
                    {/* <input
                        type="text"
                        placeholder="example.com"
                        value={domain}
                        onChange={(ev) => { setDomain(ev.target.value) }}
                        className="w-[500px] border border-slate-200 rounded-lg py-3 px-5 outline-none bg-white text-[#09141a] h-[55px]"
                    /> */}

                    {/* <select className="w-[500px] border border-slate-200 rounded-lg py-3 px-5 outline-none bg-white text-[#09141a] h-[55px]" onChange={OnLinkChange} multiple>
                        {
                            selectData?.map((item, index) => {
                                return (
                                    <option value={item.name} key={index}>{item.name}</option>
                                )
                            })
                        }
                    </select> */}
                    <Select
                        labelId="demo-multiple-checkbox-label"
                        id="demo-multiple-checkbox"
                        multiple
                        value={links}
                        onChange={OnLinkChange}
                        input={<OutlinedInput label="Tag" />}
                        renderValue={(selected) => selected.join(', ')}
                        className="w-full !max-w-[500px] border border-slate-200 rounded-lg py-3 px-5 outline-none h-[55px]"
                    >
                        {selectData.map((item, index) => (
                            <MenuItem key={index} value={item.name}>
                                <Checkbox checked={links.indexOf(item.name) > -1} />
                                <ListItemText primary={item.name} />
                            </MenuItem>
                        ))}
                    </Select>
                </Box>
                <button disabled={disabled} onClick={addEmail} className="w-[500px] border border-slate-200 rounded-lg py-3 px-5 outline-none bg-slate-500 cursor-pointer text-white">Submit</button>
            </form>
        </div>
    )
}

export default AddUsers
