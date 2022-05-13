import * as React from 'react';

import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';

import { createTheme, ThemeProvider, styled } from '@mui/material/styles';

import { alpha } from "@mui/material";
import { orange, red, green, blue } from '@mui/material/colors';
import { Stack, Typography, TextField } from '@mui/material';



const color = {
    get: green[500],
    post: orange[500],
    delete: red[500],
    put: blue[500]
}

export default function SimpleFade() {
    const structSchema = { "title": "productSchema", "type": "object", "required": ["array of object key"], "properties": { "key name": { "type": "value type" } } };
    const schemaSample = { "title": "productSchema", "type": "object", "required": ["id", "url", "method"], "properties": { "id": { "type": "integer" }, "url": { "type": "string" }, "row": { "type": "string" } } };

    const theme = createTheme({
        status: {
            danger: orange[500],
        },
    });

    return (
        <div >
            <ThemeProvider theme={theme}>
                <Stack direction="column" alignItems="flex-start">

                    <Typography variant="h3" gutterBottom component="div">
                        User Manual
                    </Typography>

                    <Typography variant="h4" gutterBottom component="div">
                        Requirements
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                        1. npm install loadtest
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                        2. npm install mocha
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                        3. npm install chai
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                        4. npm install chai-json-schema
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                        5. npm install supertest
                    </Typography>

                    <Typography variant="h4" gutterBottom component="div">
                        Node-red Requirements
                    </Typography>

                    <Typography variant="body1" gutterBottom>
                        node-red-node-sqlite
                    </Typography>

                    <Typography variant="h4" gutterBottom component="div">
                        Import Json flow
                    </Typography>

                    <Typography variant="body1" gutterBottom>
                        the node flow is inside the directory with name kapi.json
                    </Typography>

                    <Typography variant="h4" gutterBottom component="div">
                        structSchema Format
                    </Typography>
                    <Stack direction="row" alignItems="flex-start">
                        <TextField
                            id="schema-structure"

                            multiline
                            rows={25}
                            disabled
                            value={JSON.stringify(structSchema, null, 2)}

                            fullWidth
                        />
                        <TextField
                            id="schema-sample"

                            multiline
                            rows={25}
                            disabled
                            value={JSON.stringify(schemaSample, null, 2)}

                            fullWidth
                        />
                    </Stack>



                </Stack>


            </ThemeProvider>
        </div >
    );
}
