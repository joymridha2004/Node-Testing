import express from "express"
import cors from "cors"
import { routerAuth } from "./Routers/auth.Router.js"
import { routerAdmin } from "./Routers/admin.Router.js"


const app = express()
app.use(cors())
app.use(express.json())

app.use('/api/auth', routerAuth);
app.use('/api/admin', routerAdmin);

const PORT= process.env.PORT || 8081;

app.listen(PORT,'0.0.0.0', () => console.log(`Server running on port ${PORT}`));