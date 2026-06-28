import mongoose from 'mongoose'
import dns from 'node:dns'

// On some Windows setups, Node's resolver prefers IPv6 for DNS queries and
// silently fails (ECONNREFUSED) when the network path for IPv6 DNS doesn't
// work, even though IPv4 DNS and `nslookup` work fine. Forcing IPv4 resolution
// order fixes this in most cases. Safe to set unconditionally — Node-process-scoped only.
dns.setDefaultResultOrder('ipv4first')

export default async function connectDB() {
  try {
    const uri = process.env.MONGO_URI
    if (!uri) {
      console.error('MONGO_URI is not set in environment variables.')
      process.exit(1)
    }
    const conn = await mongoose.connect(uri, {
      family: 4, // force IPv4 for the underlying socket/DNS resolution
    })
    console.log(`MongoDB connected: ${conn.connection.host}`)
  } catch (err) {
    if (err.message?.includes('querySrv') || err.message?.includes('ECONNREFUSED')) {
      console.error(`
MongoDB connection error: ${err.message}

This looks like the known Windows + mongodb+srv:// DNS issue, not a credentials
or network-access problem. Node's resolver is failing an SRV lookup that
"nslookup" can do fine on the same machine.

Fix: replace the mongodb+srv://... URI in your .env with the standard
(non-SRV) connection string instead. To build it:
  1. nslookup -type=SRV _mongodb._tcp.<your-cluster-host>
     -> gives you three shard hostnames
  2. nslookup -type=TXT <your-cluster-host>
     -> gives you the replicaSet name
  3. Build: mongodb://<user>:<pass>@<shard-00-00>:27017,<shard-00-01>:27017,<shard-00-02>:27017/<db>?ssl=true&replicaSet=<name>&authSource=admin&retryWrites=true&w=majority

This has to be redone for each new cluster (the hostnames change), but not
for cluster restarts or resumes on the same cluster.
`)
    } else {
      console.error(`MongoDB connection error: ${err.message}`)
    }
    process.exit(1)
  }
}
