'use client'

// const SocialButton = ({
//   children,
//   label,
// }: // href,
// {
//   children: ReactNode
//   label: string
//   href: string
// }) => {
//   return (
//     <button
//       // bg={useColorModeValue('blackAlpha.100', 'whiteAlpha.100')}
//       bg={'blackAlpha.100'}
//       rounded={'full'}
//       w={8}
//       h={8}
//       cursor={'pointer'}
//       as={'a'}
//       // href={href}
//       display={'inline-flex'}
//       alignItems={'center'}
//       justifyContent={'center'}
//       transition={'background 0.3s ease'}
//     >
//       {children}
//     </button>
//   )
// }

export default function Footer() {
  return (
    <div
      // bg={useColorModeValue('gray.50', 'gray.900')}
      // color={useColorModeValue('gray.700', 'gray.200')}
      color={'gray.700'}
    >
      <div
      // spacing={4}
      // justify={'center'}
      // align={'center'}
      >
        {/* <Logo /> */}
        <div>
          <div>Home</div>
          <div>Sign in</div>
          <div>Sign up</div>
          <div>Contact</div>
        </div>
      </div>

      <div>
        <div
        // justify={{ base: 'center', md: 'space-between' }}
        // align={{ base: 'center', md: 'center' }}
        >
          <p>© 2024 StockTrack. All rights reserved</p>
          <div>
            {/* <SocialButton label={'Twitter'} href={'#'}>
              <FaTwitter />
            </SocialButton>
            <SocialButton label={'YouTube'} href={'#'}>
              <FaYoutube />
            </SocialButton>
            <SocialButton label={'Instagram'} href={'#'}>
              <FaInstagram />
            </SocialButton> */}
          </div>
        </div>
      </div>
    </div>
  )
}
