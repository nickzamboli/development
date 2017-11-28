const http = require('https')
const fs = require('fs')
const path = require('path')

const convertToJSON = (url = 'https://prod-edxapp.edx-cdn.org/assets/courseware/v1/07d100219da1a726dad5eddb090fa215/asset-v1:Microsoft+DEV283x+2T2017+type@asset+block/customer-data.csv') => {

    console.log('Fetching CSV', url)

    const getCSV = (csv, callback) => {
        http.get(csv, (response) => {
            let result = ''
            response.on('data', (chunk) => {
                result += chunk
            })
            response.on('end', () => {
                callback(null, result)
            })
        }).on('error', (error) => {
            console.log('Got Error: ${error.message}')
            callback(error)
        })
    }

    const convertCSV = (data) => {
        const csv = data.split('\r\n'),
            keys = csv.shift().split(',')

        let filtered = []

        csv.map((x, i) => {
            if (!x) return

            const row = x.split(',')

            let filteredRow = {}

            row.map((z, y) => {
                filteredRow[keys[y]] = z
            })

            filtered[i] = filteredRow
        })

        return JSON.stringify(filtered)
    }

    getCSV(url, (error, data) => {
        if (error) console.log(error)
        fs.writeFileSync(path.join(__dirname, 'customer-data.json'), convertCSV(data))
        console.log('Conversion finished')
    })

}

convertToJSON(process.argv[2])