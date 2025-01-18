import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import './d.css'
const Db = () => {
    document.getElementById("connect-btn").addEventListener("click", async () => {
        const host = document.getElementById("host").value;
        const user = document.getElementById("user").value;
        const password = document.getElementById("password").value;

        const output = document.getElementById("output");
        output.innerHTML = "Connecting...";

        try {
            const response = await fetch("http://localhost:3000/connect", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ host, user, password }),
            });

            if (!response.ok) {
                throw new Error("Failed to connect to the database");
            }

            const dbStructure = await response.json();
            output.innerHTML = "";

            for (const [dbName, schemas] of Object.entries(dbStructure)) {
                const dbDiv = document.createElement("div");
                dbDiv.className = "database";
                dbDiv.innerHTML = `<strong>Database: ${dbName}</strong>`;
                output.appendChild(dbDiv);

                for (const [schemaName, tables] of Object.entries(schemas)) {
                    const schemaDiv = document.createElement("div");
                    schemaDiv.className = "schema";
                    schemaDiv.innerHTML = `Schema: ${schemaName}`;
                    dbDiv.appendChild(schemaDiv);

                    for (const [tableName, columns] of Object.entries(tables)) {
                        const tableDiv = document.createElement("div");
                        tableDiv.className = "table";
                        tableDiv.innerHTML = `- Table: ${tableName}`;
                        schemaDiv.appendChild(tableDiv);

                        const columnsDiv = document.createElement("div");
                        columnsDiv.className = "columns";
                        columnsDiv.innerHTML = columns
                            .map(
                                (col) =>
                                    `• ${col.column_name} (${col.data_type})`
                            )
                            .join("<br>");
                        tableDiv.appendChild(columnsDiv);
                    }
                }
            }
        } catch (error) {
            output.innerHTML = `Error: ${error.message}`;
        }
    })
    return (

        <div class="container">
            <h1>PostgreSQL DB Visualizer</h1>
            <div class="input-group">
                <label for="host">Host</label>
                <input type="text" id="host" placeholder="e.g., localhost"/>
            </div>
            <div class="input-group">
                <label for="user">Username</label>
                <input type="text" id="user" placeholder="e.g., postgres"/>
            </div>
            <div class="input-group">
                <label for="password">Password</label>
                <input type="password" id="password"/>
            </div>
            <button id="connect-btn">Connect</button>

            <div class="output" id="output"></div>
        </div>


    );
};

export default Db;
