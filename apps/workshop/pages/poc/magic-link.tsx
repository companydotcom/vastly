import { Button } from "@companydotcom/ui";

export default function Web() {
  return (
    <div>
      <h1></h1>
      <Button>Verify</Button>
    </div>
  );
}

// import { onMounted } from 'vue'
// import { Amplify, Auth } from 'aws-amplify'

// onMounted(async () => {
//   // the search string looks like "?email=xxx&token=yyy"
//   if (window.location.search) {
//     const qs = window.location.search.substring(1)
//     const qsParams = qs.split(['&'])
//     const qsEmail = qsParams.find(x => x.startsWith('email='))
//     const qsToken = qsParams.find(x => x.startsWith('token='))
//     if (qsToken) {
//       const email = decodeURIComponent(qsEmail.substring(6))
//       const cognitoUser = await Auth.signIn(email)

//       const token = decodeURIComponent(qsToken.substring(6))
//       try {
//         const challengeResult = await Auth.sendCustomChallengeAnswer(cognitoUser, token)
//       } catch (err) {
//         console.log(err)
//         alert('The token is invalid.')
//       }
//     }
//   }
// })

// async function sendMagicLink() {
//   const response = await fetch('https://xxx.execute-api.eu-west-1.amazonaws.com/dev/login', {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json'
//     },
//     body: JSON.stringify({
//       email: email.value
//     })
//   }).catch(err => {
//     alert(`Failed to send magic link: ${err.message}`)
//   })

//   if (response.status !== 202) {
//     const responseBody = await response.json()
//     alert(`Failed to send magic link: ${responseBody.message}`)
//   } else {
//     signInStep.value = 'SENT_MAGIC_LINK'
//   }
// }
