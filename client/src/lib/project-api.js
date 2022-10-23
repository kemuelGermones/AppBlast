
// Show All Projects Request

export const getProjects = async (category = null, userId = null, userToken = null) => {
    if (category && category === 'yourposts') {
        const response = await fetch(`http://localhost:5000/projects/user/${userId}`, {
            method: 'GET',
            headers: {
                'Content-type': 'application/json',
                'Authorization': userToken
            }
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Something Went Wrong');
        return data;
    }
    if (category) {
        const response = await fetch(`http://localhost:5000/projects?category=${category}`);
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Something Went Wrong');
        return data;
    }
    const response = await fetch('http://localhost:5000/projects');
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Something Went Wrong');
    return data;
}

// Show Individual Project Request

export const getIndividualProject = async (projectId) => {
    const response = await fetch(`http://localhost:5000/projects/${projectId}`);
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Something Went Wrong');
    return data;
}

// Delete Project Request

export const deleteProject = async (projectId, projectAuthorId, userToken) => {
    const response = await fetch(`http://localhost:5000/projects/${projectId}`, {
        method: 'DELETE',
        body: JSON.stringify({ author: projectAuthorId }),
        headers: {
            'Content-type': 'application/json',
            'Authorization': userToken
        }
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Something Went Wrong');
    return data;

}

// Edit Project Request

export const editProject = async (projectData, projectId) => {
    let imageData;
    if (!!projectData.image[0]) {
        const formData = new FormData();
        formData.append('file', projectData.image[0]);
        formData.append('folder', 'AppBlast');
        formData.append('upload_preset', 'tsls69py');
        const cloudinaryRes = await fetch(`https://api.cloudinary.com/v1_1/de9dxfdav/image/upload`, {
            method: 'POST',
            body: formData,
        });
        const cloudinaryData = await cloudinaryRes.json();
        if (!cloudinaryRes.ok) throw new Error('Cannot upload image to cloudinary');
        imageData = {
            url: cloudinaryData.secure_url,
            filename: cloudinaryData.public_id
        }
    } else {
        imageData = projectData.image;
    }
    const transformedData = {
        title: projectData.title,
        link: projectData.link,
        image: imageData,
        description: projectData.description,
        author: projectData.author,
    };
    const response = await fetch(`http://localhost:5000/projects/${projectId}`, {
        method: 'PUT',
        body: JSON.stringify(transformedData),
        headers: {
            'Content-Type': 'application/json',
            'Authorization': projectData.userToken
        }
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Something Went Wrong');
    return data;
}

// New Project Request

export const newProject = async (projectData) => {
    const formData = new FormData();
    formData.append('file', projectData.image[0]);
    formData.append('folder', 'AppBlast');
    formData.append('upload_preset', 'tsls69py');
    const cloudinaryRes = await fetch(`https://api.cloudinary.com/v1_1/de9dxfdav/image/upload`, {
        method: 'POST',
        body: formData,
    });
    const cloudinaryData = await cloudinaryRes.json();
    if (!cloudinaryRes.ok) throw new Error('Cannot upload image to cloudinary');
    const transformedData = {
        title: projectData.title,
        link: projectData.link,
        image:
        {
            url: cloudinaryData.secure_url,
            filename: cloudinaryData.public_id
        },
        description: projectData.description,
        author: projectData.author,
    };
    const response = await fetch(`http://localhost:5000/projects`, {
        method: 'POST',
        body: JSON.stringify(transformedData),
        headers: {
            'Content-Type': 'application/json',
            'Authorization': projectData.userToken
        }
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Something Went Wrong');
    return data;
}