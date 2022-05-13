import React, { Component, Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Spinner from './Spinner';

const Setting = lazy(() => import('./pages/setting'))
const ApiWeb = lazy(() => import('./pages/ApiWeb'))
const ApiTest = lazy(() => import('./pages/ApiTest'))
const ReadMe = lazy(() => import('./pages/help'))
class AppRoutes extends Component {
    render() {
        return (
            <Suspense fallback={<Spinner />}>

                <Routes >
                    <Route exact path="/setting" element={<Setting></Setting>} />
                    <Route exact path="/test" element={<ApiTest></ApiTest>} />
                    <Route exact path="/help" element={<ReadMe></ReadMe>} />
                    <Route exact path="*" element={<ApiWeb></ApiWeb>} />

                </Routes>


            </Suspense>
        );
    }
}

export default AppRoutes;
