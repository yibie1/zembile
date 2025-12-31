import React, {useState} from 'react'

export default function PaymentProof(){
  const [file, setFile] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if(!file) return alert('Please select a file')

    const fd = new FormData()
    fd.append('proof', file)

    // TODO: wire to API endpoint /api/uploads
    const res = await fetch('/api/uploads', { method: 'POST', body: fd })
    if(res.ok) alert('Uploaded successfully')
    else alert('Upload failed')
  }

  return (
    <div className="max-w-lg mx-auto">
      <h2 className="text-2xl font-bold mb-4">Upload Payment Proof</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <input type="file" accept="image/*,application/pdf" onChange={e => setFile(e.target.files[0])} />
        </div>
        <div>
          <button className="bg-zembile-yellow text-zembile-gray px-4 py-2 rounded-md font-semibold">Upload Proof</button>
        </div>
      </form>
    </div>
  )
}
