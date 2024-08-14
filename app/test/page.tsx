import axios from 'axios';

const testPage = () => {
    const postData = async () => {
        try {
            const response = await axios.post('http://localhost:8080/register', {
                firstName: 'John',
                lastName: "Doe",
                contactNumber: "09984042082",
                email: "doe@gmail.com",
                password: "johndoe123"
            });
            console.log(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    postData();

    return <div>Register Page</div>;
};

export default testPage;