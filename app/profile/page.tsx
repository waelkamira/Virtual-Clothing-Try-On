'use client';

import { useState, type ChangeEvent } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Camera,
  Edit2,
  Save,
} from 'lucide-react';
import Navbar from '@/components/navbar';
import Footer from '@/components/footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';

export default function ProfilePage() {
  const { toast } = useToast();

  // Mock user data - in a real app, this would come from authentication
  const [user, setUser] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    address: {
      street: '123 Main St',
      city: 'New York',
      state: 'NY',
      zip: '10001',
      country: 'United States',
    },
    avatar: '/placeholder.svg?height=200&width=200&text=JD',
    measurements: {
      height: 180, // cm
      weight: 75, // kg
      chest: 100, // cm
      waist: 85, // cm
      hips: 95, // cm
      inseam: 80, // cm
      shoulder: 45, // cm
      sleeve: 65, // cm
    },
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState(user);

  // Mock order history
  const [orders, setOrders] = useState([
    {
      id: 'ORD-12345',
      date: '2023-06-15',
      total: 129.99,
      status: 'Delivered',
      items: [
        {
          id: 'item-1',
          name: 'Classic White T-Shirt',
          price: 29.99,
          quantity: 1,
          image: '/placeholder.svg?height=100&width=80&text=T-Shirt',
        },
        {
          id: 'item-2',
          name: 'Slim Fit Jeans',
          price: 99.99,
          quantity: 1,
          image: '/placeholder.svg?height=100&width=80&text=Jeans',
        },
      ],
    },
    {
      id: 'ORD-12346',
      date: '2023-05-20',
      total: 79.99,
      status: 'Delivered',
      items: [
        {
          id: 'item-3',
          name: 'Wool Sweater',
          price: 79.99,
          quantity: 1,
          image: '/placeholder.svg?height=100&width=80&text=Sweater',
        },
      ],
    },
  ]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name.includes('.')) {
      const [section, field] = name.split('.') as [
        'address' | 'measurements',
        string,
      ];
      setEditedUser((prev) => {
        const currentSection = prev[section] as Record<string, string | number>;
        const parsedValue =
          section === 'measurements' && !Number.isNaN(Number(value))
            ? Number(value)
            : value;

        return {
          ...prev,
          [section]: {
            ...currentSection,
            [field]: parsedValue,
          },
        };
      });
    } else {
      setEditedUser((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSave = () => {
    setUser(editedUser);
    setIsEditing(false);
    toast({
      title: 'Profile updated',
      description: 'Your profile information has been updated successfully',
    });
  };

  const handleCancel = () => {
    setEditedUser(user);
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container mx-auto px-4 pt-24 pb-16">
        <div className="flex items-center mb-6">
          <Link
            href="/"
            className="mr-4 p-2 rounded-full bg-orange-500/10 text-muted-foreground hover:text-foreground hover:bg-orange-500/20 transition-colors"
          >
            <ArrowLeft size={20} />
          </Link>
          <h1 className="text-2xl font-bold">My Profile</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1">
            <Card>
              <CardContent className="p-6 flex flex-col items-center">
                <div className="relative w-32 h-32 mb-4">
                  <Image
                    src={user.avatar || '/placeholder.svg'}
                    alt={user.name}
                    fill
                    className="object-cover rounded-full"
                  />
                  <button className="absolute bottom-0 right-0 bg-orange-500 text-white p-2 rounded-full">
                    <Camera size={16} />
                  </button>
                </div>
                <h2 className="text-xl font-bold mb-1">{user.name}</h2>
                <p className="text-muted-foreground mb-4">{user.email}</p>

                <div className="w-full space-y-3">
                  <div className="flex items-center">
                    <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span className="text-sm">{user.email}</span>
                  </div>
                  <div className="flex items-center">
                    <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span className="text-sm">{user.phone}</span>
                  </div>
                  <div className="flex items-start">
                    <MapPin className="h-4 w-4 mr-2 text-muted-foreground mt-0.5" />
                    <span className="text-sm">
                      {user.address.street}, {user.address.city},{' '}
                      {user.address.state} {user.address.zip},{' '}
                      {user.address.country}
                    </span>
                  </div>
                </div>

                <Button
                  className="w-full mt-6 bg-orange-500 hover:bg-orange-600"
                  onClick={() => setIsEditing(true)}
                >
                  <Edit2 className="mr-2 h-4 w-4" />
                  Edit Profile
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="md:col-span-2">
            <Tabs defaultValue="personal">
              <TabsList className="mb-6">
                <TabsTrigger value="personal">Personal Info</TabsTrigger>
                <TabsTrigger value="measurements">Measurements</TabsTrigger>
                <TabsTrigger value="orders">Order History</TabsTrigger>
              </TabsList>

              <TabsContent value="personal">
                <Card>
                  <CardHeader>
                    <CardTitle>Personal Information</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {isEditing ? (
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="name">Full Name</Label>
                            <Input
                              id="name"
                              name="name"
                              value={editedUser.name}
                              onChange={handleInputChange}
                            />
                          </div>
                          <div>
                            <Label htmlFor="email">Email</Label>
                            <Input
                              id="email"
                              name="email"
                              type="email"
                              value={editedUser.email}
                              onChange={handleInputChange}
                            />
                          </div>
                          <div>
                            <Label htmlFor="phone">Phone</Label>
                            <Input
                              id="phone"
                              name="phone"
                              value={editedUser.phone}
                              onChange={handleInputChange}
                            />
                          </div>
                        </div>

                        <div className="mt-6">
                          <h3 className="text-lg font-medium mb-3">Address</h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="street">Street</Label>
                              <Input
                                id="street"
                                name="address.street"
                                value={editedUser.address.street}
                                onChange={handleInputChange}
                              />
                            </div>
                            <div>
                              <Label htmlFor="city">City</Label>
                              <Input
                                id="city"
                                name="address.city"
                                value={editedUser.address.city}
                                onChange={handleInputChange}
                              />
                            </div>
                            <div>
                              <Label htmlFor="state">State/Province</Label>
                              <Input
                                id="state"
                                name="address.state"
                                value={editedUser.address.state}
                                onChange={handleInputChange}
                              />
                            </div>
                            <div>
                              <Label htmlFor="zip">ZIP/Postal Code</Label>
                              <Input
                                id="zip"
                                name="address.zip"
                                value={editedUser.address.zip}
                                onChange={handleInputChange}
                              />
                            </div>
                            <div>
                              <Label htmlFor="country">Country</Label>
                              <Input
                                id="country"
                                name="address.country"
                                value={editedUser.address.country}
                                onChange={handleInputChange}
                              />
                            </div>
                          </div>
                        </div>

                        <div className="flex gap-2 mt-6">
                          <Button
                            className="bg-orange-500 hover:bg-orange-600"
                            onClick={handleSave}
                          >
                            <Save className="mr-2 h-4 w-4" />
                            Save Changes
                          </Button>
                          <Button variant="outline" onClick={handleCancel}>
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <h3 className="text-sm font-medium text-muted-foreground">
                              Full Name
                            </h3>
                            <p>{user.name}</p>
                          </div>
                          <div>
                            <h3 className="text-sm font-medium text-muted-foreground">
                              Email
                            </h3>
                            <p>{user.email}</p>
                          </div>
                          <div>
                            <h3 className="text-sm font-medium text-muted-foreground">
                              Phone
                            </h3>
                            <p>{user.phone}</p>
                          </div>
                        </div>

                        <div>
                          <h3 className="text-lg font-medium mb-3">Address</h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <h3 className="text-sm font-medium text-muted-foreground">
                                Street
                              </h3>
                              <p>{user.address.street}</p>
                            </div>
                            <div>
                              <h3 className="text-sm font-medium text-muted-foreground">
                                City
                              </h3>
                              <p>{user.address.city}</p>
                            </div>
                            <div>
                              <h3 className="text-sm font-medium text-muted-foreground">
                                State/Province
                              </h3>
                              <p>{user.address.state}</p>
                            </div>
                            <div>
                              <h3 className="text-sm font-medium text-muted-foreground">
                                ZIP/Postal Code
                              </h3>
                              <p>{user.address.zip}</p>
                            </div>
                            <div>
                              <h3 className="text-sm font-medium text-muted-foreground">
                                Country
                              </h3>
                              <p>{user.address.country}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="measurements">
                <Card>
                  <CardHeader>
                    <CardTitle>Body Measurements</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="p-4 bg-card/50 border border-border rounded-lg">
                        <h3 className="text-sm font-medium text-muted-foreground mb-1">
                          Height
                        </h3>
                        <p className="text-xl font-bold">
                          {user.measurements.height} cm
                        </p>
                      </div>
                      <div className="p-4 bg-card/50 border border-border rounded-lg">
                        <h3 className="text-sm font-medium text-muted-foreground mb-1">
                          Weight
                        </h3>
                        <p className="text-xl font-bold">
                          {user.measurements.weight} kg
                        </p>
                      </div>
                      <div className="p-4 bg-card/50 border border-border rounded-lg">
                        <h3 className="text-sm font-medium text-muted-foreground mb-1">
                          Chest
                        </h3>
                        <p className="text-xl font-bold">
                          {user.measurements.chest} cm
                        </p>
                      </div>
                      <div className="p-4 bg-card/50 border border-border rounded-lg">
                        <h3 className="text-sm font-medium text-muted-foreground mb-1">
                          Waist
                        </h3>
                        <p className="text-xl font-bold">
                          {user.measurements.waist} cm
                        </p>
                      </div>
                      <div className="p-4 bg-card/50 border border-border rounded-lg">
                        <h3 className="text-sm font-medium text-muted-foreground mb-1">
                          Hips
                        </h3>
                        <p className="text-xl font-bold">
                          {user.measurements.hips} cm
                        </p>
                      </div>
                      <div className="p-4 bg-card/50 border border-border rounded-lg">
                        <h3 className="text-sm font-medium text-muted-foreground mb-1">
                          Inseam
                        </h3>
                        <p className="text-xl font-bold">
                          {user.measurements.inseam} cm
                        </p>
                      </div>
                      <div className="p-4 bg-card/50 border border-border rounded-lg">
                        <h3 className="text-sm font-medium text-muted-foreground mb-1">
                          Shoulder
                        </h3>
                        <p className="text-xl font-bold">
                          {user.measurements.shoulder} cm
                        </p>
                      </div>
                      <div className="p-4 bg-card/50 border border-border rounded-lg">
                        <h3 className="text-sm font-medium text-muted-foreground mb-1">
                          Sleeve
                        </h3>
                        <p className="text-xl font-bold">
                          {user.measurements.sleeve} cm
                        </p>
                      </div>
                    </div>

                    <Button className="mt-6 bg-orange-500 hover:bg-orange-600">
                      <Edit2 className="mr-2 h-4 w-4" />
                      Update Measurements
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="orders">
                <Card>
                  <CardHeader>
                    <CardTitle>Order History</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {orders.length > 0 ? (
                      <div className="space-y-6">
                        {orders.map((order) => (
                          <div
                            key={order.id}
                            className="border border-border rounded-lg overflow-hidden"
                          >
                            <div className="bg-muted p-4 flex flex-wrap items-center justify-between gap-4">
                              <div>
                                <h3 className="font-medium">{order.id}</h3>
                                <p className="text-sm text-muted-foreground">
                                  Ordered on {order.date}
                                </p>
                              </div>
                              <div className="text-right">
                                <p className="font-bold text-orange-500">
                                  ${order.total.toFixed(2)}
                                </p>
                                <span className="inline-block px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                                  {order.status}
                                </span>
                              </div>
                            </div>
                            <div className="p-4">
                              {order.items.map((item) => (
                                <div
                                  key={item.id}
                                  className="flex items-center gap-4 py-3 border-b border-border last:border-0"
                                >
                                  <div className="w-16 h-16 relative">
                                    <Image
                                      src={item.image || '/placeholder.svg'}
                                      alt={item.name}
                                      fill
                                      className="object-cover rounded"
                                    />
                                  </div>
                                  <div className="flex-1">
                                    <h4 className="font-medium">{item.name}</h4>
                                    <p className="text-sm text-muted-foreground">
                                      Qty: {item.quantity}
                                    </p>
                                  </div>
                                  <div className="text-right">
                                    <p className="font-medium">
                                      ${item.price.toFixed(2)}
                                    </p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <h3 className="text-lg font-medium mb-2">
                          No orders yet
                        </h3>
                        <p className="text-muted-foreground mb-6">
                          You haven't placed any orders yet
                        </p>
                        <Button
                          className="bg-orange-500 hover:bg-orange-600"
                          asChild
                        >
                          <Link href="/stores">Start Shopping</Link>
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
