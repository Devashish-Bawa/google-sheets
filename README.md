# Google Sheets Clone

This project is a Google Sheets clone implemented using HTML, CSS, and JavaScript. It provides a web-based spreadsheet application with several features similar to Google Sheets.

## Features

1. **Basic Arithmetic Operations:** Supports basic arithmetic operations from the formula bar.

2. **Cell Properties:** Each cell can have properties such as Bold, Italics, Underline, Alignment, Cell Color, and Font Color.

3. **Font Options:** Supports 4 font families and 4 font sizes.

4. **Range-based Copy-Paste:** Allows range-based copy-paste functionality. Cut functionality is also range-based.

5. **Multiple Sheets:** Supports multiple sheets, and sheets can be deleted by right-clicking on the sheet title.

6. **Cycle Detection:** Detects cycles in cell dependencies in formulas.

7. **Cycle Tracing:** Features the ability to trace all nodes involved in cycles, highlighting all cells with blue color and the source node with orange color.

8. **Dynamic Update:** If a single cell's value changes, all connected child nodes' values will also be updated based on the new value, achieved using Depth-First Search (DFS).
