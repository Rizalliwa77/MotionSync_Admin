import React, { useState, useEffect } from 'react';
import '../../assets/General/hubContent.css';
import Sidebar from '../Sidebar';

const HubContent = () => {
    const [isSidebarHovered, setIsSidebarHovered] = useState(false);
    const [selectedHub, setSelectedHub] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [hubs, setHubs] = useState([]);

    // Initialize hubs data
    useEffect(() => {
        const initialHubs = [
            { id: 1, name: "Sign Language Institute", email: "info@signlanguageinstitute.com", users: 10, tokenId: "#SLI1-" },
            { id: 2, name: "Hands of Hope ASL Center", email: "contact@handsofhopeasl.org", users: 10, tokenId: "#HHC2-" },
            { id: 3, name: "ASL Learning Hub", email: "support@asllearninghub.com", users: 11, tokenId: "#ALH3-" },
            { id: 4, name: "Fluent Fingers ASL Academy", email: "info@fluentfingersasl.edu", users: 10, tokenId: "#FFA4-" },
        ];
        setHubs(initialHubs);
    }, []);

    // Dummy data for hub files
    const hubFiles = {
        1: [
            { id: 1, name: "Training Materials", type: "folder", items: ["lesson1.pdf", "lesson2.pdf"] },
            { id: 2, name: "Student Records", type: "folder", items: ["records2024.xlsx"] },
        ],
        2: [
            { id: 3, name: "Course Content", type: "folder", items: ["module1.pdf", "module2.pdf"] },
            { id: 4, name: "Resources", type: "folder", items: ["resource1.pdf", "resource2.pdf"] },
        ],
        3: [
            { id: 5, name: "Assessments", type: "folder", items: ["test1.pdf", "test2.pdf"] },
            { id: 6, name: "Learning Materials", type: "folder", items: ["material1.pdf", "material2.pdf"] },
        ],
        4: [
            { id: 7, name: "Documentation", type: "folder", items: ["doc1.pdf", "doc2.pdf"] },
            { id: 8, name: "Teaching Resources", type: "folder", items: ["resource1.pdf", "resource2.pdf"] },
        ],
    };

    const filteredHubs = hubs.filter(hub =>
        hub.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        hub.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        hub.tokenId.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="dashboard">
            <Sidebar onHoverChange={setIsSidebarHovered} />
            <main className={`main-content ${isSidebarHovered ? 'sidebar-hovered' : ''}`}>
                <div className="hub-content">
                    <div className="overview-section">
                        <h1>Hub Content Management</h1>
                    </div>

                    {/* Search Bar */}
                    <div className="search-section">
                        <div className="search-bar">
                            <input
                                type="text"
                                placeholder="Search hubs..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            <span className="material-symbols-outlined">search</span>
                        </div>
                    </div>

                    {/* Hubs Table */}
                    <div className="hubs-table-section">
                        <table className="hubs-table">
                            <thead>
                                <tr>
                                    <th>Learning Hub</th>
                                    <th>Email Address</th>
                                    <th>User #</th>
                                    <th>Token ID</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredHubs.map((hub) => (
                                    <tr
                                        key={hub.id}
                                        onClick={() => setSelectedHub(hub)}
                                        className={selectedHub?.id === hub.id ? 'selected' : ''}
                                    >
                                        <td>{hub.name}</td>
                                        <td>{hub.email}</td>
                                        <td>{hub.users}</td>
                                        <td>{hub.tokenId}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Hub Files Section */}
                    {selectedHub && (
                        <div className="hub-files-section">
                            <h2>Hub Files - {selectedHub.name}</h2>
                            <div className="folders-grid">
                                {hubFiles[selectedHub.id]?.map(folder => (
                                    <div key={folder.id} className="folder-card">
                                        <span className="material-symbols-outlined">folder</span>
                                        <h3>{folder.name}</h3>
                                        <p>{folder.items.length} items</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default HubContent;
