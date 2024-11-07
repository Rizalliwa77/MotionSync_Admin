import React, { useState } from 'react';
import '../../assets/General/Translation.css';
import Sidebar from '../Sidebar';

const TranslationManagement = () => {
    const [isSidebarHovered, setIsSidebarHovered] = useState(false);

    const handleSidebarHover = (hovered) => {
        setIsSidebarHovered(hovered);
    };

    return (
        <div className="dashboard">
            <Sidebar onHoverChange={handleSidebarHover} />
            <main className={`main-content ${isSidebarHovered ? 'sidebar-hovered' : ''}`}>
                <div className="translation-management">
                    <div className="overview-section">
                        <h1>Translation Management</h1>
                    </div>

                    <div className="translation-section">
                        <h2>Sign Language to Text</h2>

                        <div className="translation-info">
                            <div className="translation-algorithm">
                                <label>Translation Algorithm V.1.1</label>
                                <select>
                                    <option value="v1.1">V.1.1</option>
                                    {/* Add more options as needed */}
                                </select>
                            </div>

                            <div className="update-section">
                                <button>Integrate New Update</button>
                                <form>
                                    <label>Admin Code</label>
                                    <input type="text" />
                                    <label>Password</label>
                                    <input type="password" />
                                    <button type="submit">Confirm</button>
                                </form>
                                <button>Settings</button>
                            </div>

                            <div className="version-history">
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Version</th>
                                            <th>Date Modified</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>Dummy Version 99</td>
                                            <td>06/07/2024</td>
                                        </tr>
                                        <tr>
                                            <td>Dummy Version 98</td>
                                            <td>05/23/2024</td>
                                        </tr>
                                        <tr>
                                            <td>Dummy Version 97</td>
                                            <td>05/01/2024</td>
                                        </tr>
                                        <tr>
                                            <td>Dummy Version 96</td>
                                            <td>4/20/2024</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    <div className="translation-section">
                        <h2>Text to Sign Language</h2>

                        <div className="translation-info">
                            <div className="translation-algorithm">
                                <label>Translation Algorithm V.1.1</label>
                                <select>
                                    <option value="v1.1">V.1.1</option>
                                    {/* Add more options as needed */}
                                </select>
                            </div>

                            <div className="update-section">
                                <button>Integrate New Update</button>
                                <form>
                                    <label>Admin Code</label>
                                    <input type="text" />
                                    <label>Password</label>
                                    <input type="password" />
                                    <button type="submit">Confirm</button>
                                </form>
                                <button>Settings</button>
                            </div>

                            <div className="version-history">
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Version</th>
                                            <th>Date Modified</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>Dummy Version 99</td>
                                            <td>06/07/2024</td>
                                        </tr>
                                        <tr>
                                            <td>Dummy Version 98</td>
                                            <td>05/23/2024</td>
                                        </tr>
                                        <tr>
                                            <td>Dummy Version 97</td>
                                            <td>05/01/2024</td>
                                        </tr>
                                        <tr>
                                            <td>Dummy Version 96</td>
                                            <td>4/20/2024</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default TranslationManagement;