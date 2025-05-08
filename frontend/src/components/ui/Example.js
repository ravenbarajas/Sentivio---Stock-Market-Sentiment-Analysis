import React, { useState } from 'react';
import {
  Button,
  Input,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  Select,
  SelectOption,
  SelectGroup,
  Badge,
  Alert,
  AlertTitle,
  AlertDescription
} from './index';

/**
 * Example component that demonstrates usage of all UI components
 */
const Example = () => {
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [showAlert, setShowAlert] = useState(false);

  // Example form submit handler
  const handleSubmit = (e) => {
    e.preventDefault();
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 3000);
  };

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '2rem 1rem' }}>
      <h1 style={{ marginBottom: '2rem', textAlign: 'center' }}>UI Component Library</h1>
      
      {/* Tabs example */}
      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="form">Form Components</TabsTrigger>
          <TabsTrigger value="display">Display Components</TabsTrigger>
        </TabsList>
        
        {/* Overview tab */}
        <TabsContent value="overview">
          <Card>
            <CardHeader>
              <CardTitle>Shadcn-inspired UI Components</CardTitle>
              <CardDescription>A collection of reusable UI components built with React and CSS.</CardDescription>
            </CardHeader>
            <CardContent>
              <p style={{ marginBottom: '1rem' }}>
                This is a demo of UI components that mimic the look and feel of Shadcn UI but are built with 
                regular CSS instead of Tailwind. The components are designed to be customizable and accessible.
              </p>
              <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                <Badge>Default</Badge>
                <Badge variant="secondary">Secondary</Badge>
                <Badge variant="outline">Outline</Badge>
                <Badge variant="destructive">Destructive</Badge>
              </div>
              <Alert className="ui-alert-animate-in">
                <AlertTitle>Note</AlertTitle>
                <AlertDescription>
                  Select the tabs above to see more examples of the components.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Form components tab */}
        <TabsContent value="form">
          <Card>
            <CardHeader>
              <CardTitle>Form Components</CardTitle>
              <CardDescription>Examples of form components.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '1rem' }}>
                  <label htmlFor="name" style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500' }}>
                    Name
                  </label>
                  <Input
                    id="name"
                    placeholder="Enter your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                
                <div style={{ marginBottom: '1rem' }}>
                  <label htmlFor="role" style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500' }}>
                    Role
                  </label>
                  <Select
                    id="role"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    placeholder="Select your role"
                  >
                    <SelectGroup label="Engineering">
                      <SelectOption value="frontend">Frontend Developer</SelectOption>
                      <SelectOption value="backend">Backend Developer</SelectOption>
                      <SelectOption value="fullstack">Full Stack Developer</SelectOption>
                    </SelectGroup>
                    <SelectGroup label="Design">
                      <SelectOption value="ux">UX Designer</SelectOption>
                      <SelectOption value="ui">UI Designer</SelectOption>
                    </SelectGroup>
                  </Select>
                </div>
                
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <Button type="submit">Submit</Button>
                  <Button variant="outline" type="button">Cancel</Button>
                </div>
              </form>
              
              {showAlert && (
                <Alert variant="destructive" className="ui-alert-animate-in" style={{ marginTop: '1rem' }}>
                  <AlertTitle>Form Submitted</AlertTitle>
                  <AlertDescription>
                    Your information has been submitted successfully.
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Display components tab */}
        <TabsContent value="display">
          <Card>
            <CardHeader>
              <CardTitle>Display Components</CardTitle>
              <CardDescription>Examples of display components.</CardDescription>
            </CardHeader>
            <CardContent>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <h3 style={{ marginBottom: '0.5rem' }}>Buttons</h3>
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <Button>Default</Button>
                    <Button variant="secondary">Secondary</Button>
                    <Button variant="outline">Outline</Button>
                    <Button variant="ghost">Ghost</Button>
                    <Button variant="link">Link</Button>
                    <Button variant="destructive">Destructive</Button>
                  </div>
                </div>
                
                <div>
                  <h3 style={{ marginBottom: '0.5rem' }}>Badges</h3>
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <Badge>Default</Badge>
                    <Badge variant="secondary">Secondary</Badge>
                    <Badge variant="outline">Outline</Badge>
                    <Badge variant="destructive">Destructive</Badge>
                  </div>
                </div>
                
                <div>
                  <h3 style={{ marginBottom: '0.5rem' }}>Alerts</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <Alert>
                      <AlertTitle>Information</AlertTitle>
                      <AlertDescription>
                        This is an informational alert.
                      </AlertDescription>
                    </Alert>
                    
                    <Alert variant="destructive">
                      <AlertTitle>Error</AlertTitle>
                      <AlertDescription>
                        This is an error alert.
                      </AlertDescription>
                    </Alert>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline">Previous</Button>
              <Button style={{ marginLeft: 'auto' }}>Next</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Example; 