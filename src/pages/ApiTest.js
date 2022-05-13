import * as React from 'react';

import Box from '@mui/material/Box';
import Switch from '@mui/material/Switch';
import Paper from '@mui/material/Paper';
import Fade from '@mui/material/Fade';
import FormControlLabel from '@mui/material/FormControlLabel';
import { InputLabel, Select, MenuItem, Grid, Card, CardContent, CardHeader, IconButton, Divider, TextField, Typography, Button, Stack, FormControl } from '@mui/material';

import { createTheme, ThemeProvider, styled } from '@mui/material/styles';

import { alpha } from "@mui/material";
import { orange, red, green, blue } from '@mui/material/colors';
import { api } from '../service/index'
import axios from 'axios';
import DoneIcon from '@mui/icons-material/Done';
import CloseIcon from '@mui/icons-material/Close';
const icon = (
    <Paper sx={{ m: 1 }} elevation={4}>
        <Box component="svg" sx={{ width: 100, height: 100 }}>
            <Box
                component="polygon"
                sx={{
                    fill: (theme) => theme.palette.common.white,
                    stroke: (theme) => theme.palette.divider,
                    strokeWidth: 1,
                }}
                points="0,100 50,00, 100,100"
            />
        </Box>
    </Paper>
);

const color = {
    get: green[500],
    post: orange[500],
    delete: red[500],
    put: blue[500]
}

export default function SimpleFade() {

    const [data, setData] = React.useState([]);
    const [selected, setSelected] = React.useState({});
    const init = { selected: false, validated: false, triggered: false, result: false };
    const [state, setState] = React.useState(init);
    const [loadResult, setLoadResult] = React.useState("")
    let loadTestResult = "";
    let result = [];
    React.useEffect(() => {
        fetch(`http://127.0.0.1:1880/kapitest`)
            .then(results => results.json())
            .then(data => {

                let child = data.filter(item => item.method == "get").map(function (obj) {
                    if (obj.isCustom == 1) {
                        obj.parent = obj.customCategory;
                    } else {
                        obj.parent = obj.category;
                    }
                    return obj
                })

                setData(child);
            });
    }, [])
    const handleSelect = (e) => {
        const chosen = data.filter(item => item.id == e.target.value)
        setSelected(chosen[0]);
        let currState = Object.assign({}, state);
        currState['selected'] = true
        currState['validated'] = false
        currState['triggered'] = false
        currState['result'] = false
        setState(currState)

    }

    const theme = createTheme({
        status: {
            danger: orange[500],
        },
    });
    async function getResult() {
        let resp = {};
        resp = await fetch(`http://127.0.0.1:1880/kapi/loadtest${selected.url}`)
        loadTestResult = await resp.text()
        console.log(loadTestResult)
        let currState = Object.assign({}, state);
        currState['result'] = true
        setLoadResult(loadTestResult)
        setState(currState)

    }

    async function getSynTestResult() {
        const response = await axios.post(`http://127.0.0.1:1880/kapi/syntest`, selected);
        console.log(response.data)
        let currState = Object.assign({}, state);
        currState['result'] = true
        setLoadResult(JSON.stringify(response.data, null, 4))
        setState(currState)

    }
    const handleLoadButtonOnClick = () => {


        getResult()
    }
    const handleSyntaxButtonOnClick = () => {
        getSynTestResult();
    }
    const validateSub = (param) => {
        console.log(param)
        if (param != null || param != undefined) {
            result.push(true)
            return <DoneIcon sx={{ color: '#1f1' }}></DoneIcon>
        } else {
            result.push(false)
            return <CloseIcon sx={{ color: '#f11' }}></CloseIcon>
        }
    }

    const validateMain = (param) => {
        let render = <>

            <h5>Define URL {validateSub(selected.url)} Define Schema Created {validateSub(selected.structSchema)} Define Structure Type {validateSub(selected.structType)}</h5>

        </>
        let choice = ""
        if (result.every(e => e == true)) {
            choice =


                <Stack direction="row" spacing={2}>
                    <Button variant="outlined" onClick={() => handleLoadButtonOnClick()}>
                        Load Test
                    </Button>
                    <Button variant="outlined" onClick={() => handleSyntaxButtonOnClick()}>
                        Syntax Test
                    </Button>
                </Stack>


        } else {
            choice =
                <h5> please do set up the structure schema at setting page</h5>
        }
        result = []
        return (<>
            {render}
            {choice}
        </>
        )

    }
    return (
        <div style={{ height: '83vh' }}>
            <ThemeProvider theme={theme}>
                <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label">API</InputLabel>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={selected.url}
                        label="API"
                        onChange={handleSelect}
                    >
                        {data.map((e) => (
                            <MenuItem value={e.id}>{e.url}</MenuItem>
                        ))}

                    </Select>
                </FormControl>
                {state.selected && <>
                    {validateMain(selected)}

                </>}

                {state.triggered &&
                    <h5> Generating Test Case</h5>
                }
                {state.result &&
                    <TextField
                        id="test-result-box"

                        multiline
                        rows={25}
                        disabled
                        value={loadResult}

                        fullWidth
                    />

                }


            </ThemeProvider>
        </div >
    );
}
