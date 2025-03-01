'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectTrigger, SelectItem } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'react-hot-toast';
import { Calendar } from '@/components/ui/calendar';

const doctorsData = ['Dr. Smith', 'Dr. Johnson', 'Dr. Brown', 'Dr. Davis'];

export default function Appointment() {
    const [location, setLocation] = useState('');
    const [selectedDoctor, setSelectedDoctor] = useState('');
    const [date, setDate] = useState(null);
    const [time, setTime] = useState('');

    const handleBook = () => {
        if (!location || !selectedDoctor || !date || !time) {
            toast.error('Please fill all fields.');
            return;
        }
        toast.success(`Appointment booked with ${selectedDoctor} on ${date.toDateString()} at ${time}.`);
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <Card className="w-full max-w-lg bg-white rounded-2xl shadow-xl p-6">
                <CardContent>
                    <h2 className="text-2xl font-bold text-center text-black mb-6">Book an Appointment</h2>
                    <div className="mb-4">
                        <Label className="text-black">Location</Label>
                        <Input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Enter your city" className="mt-1 text-black" />
                    </div>
                    <div className="mb-4">
                        <Label className="text-black">Doctor</Label>
                        <Select onValueChange={setSelectedDoctor}>
                            <SelectTrigger className="mt-1 text-black" placeholder="Select a doctor" />
                            <SelectContent>
                                {doctorsData.map((doc, index) => (
                                    <SelectItem key={index} value={doc} className="text-black">{doc}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="mb-4">
                        <Label className="text-black">Date</Label>
                        <Calendar selected={date} onSelect={setDate} className="mt-1 text-black" />
                    </div>
                    <div className="mb-4">
                        <Label className="text-black">Time</Label>
                        <Select onValueChange={setTime}>
                            <SelectTrigger className="mt-1 text-black" placeholder="Select time of day" />
                            <SelectContent>
                                <SelectItem value="Morning" className="text-black">Morning</SelectItem>
                                <SelectItem value="Afternoon" className="text-black">Afternoon</SelectItem>
                                <SelectItem value="Evening" className="text-black">Evening</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <Button onClick={handleBook} className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md">Book Appointment</Button>
                </CardContent>
            </Card>
        </div>
    );
}
