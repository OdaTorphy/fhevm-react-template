#!/usr/bin/env node

import { Command } from 'commander';
import chalk from 'chalk';
import ora from 'ora';
import { createFhevmClient } from 'fhevm-sdk';

const program = new Command();

program
  .name('fhevm')
  .description('CLI tool for FHEVM encryption')
  .version('1.0.0');

program
  .command('encrypt')
  .description('Encrypt a value using FHEVM')
  .argument('<value>', 'Value to encrypt')
  .option('-t, --type <type>', 'Encryption type (uint64, uint32, uint16, uint8, bool)', 'uint64')
  .option('-n, --network <network>', 'Network (sepolia, mainnet)', 'sepolia')
  .option('-c, --contract <address>', 'Contract address')
  .action(async (value, options) => {
    const spinner = ora('Initializing FHEVM client...').start();

    try {
      // Validate contract address
      if (!options.contract) {
        spinner.fail(chalk.red('Contract address is required'));
        console.log(chalk.yellow('\nUsage: fhevm encrypt <value> --contract 0x...'));
        process.exit(1);
      }

      // Initialize client
      const client = await createFhevmClient({
        network: options.network,
        contractAddress: options.contract,
      });

      spinner.text = 'Encrypting value...';

      // Encrypt based on type
      let encrypted;
      const type = options.type.toLowerCase();

      switch (type) {
        case 'uint64':
          encrypted = await client.encrypt64(BigInt(value));
          break;
        case 'uint32':
          encrypted = await client.encrypt32(parseInt(value));
          break;
        case 'uint16':
          encrypted = await client.encrypt16(parseInt(value));
          break;
        case 'uint8':
          encrypted = await client.encrypt8(parseInt(value));
          break;
        case 'bool':
          encrypted = await client.encryptBool(value === 'true');
          break;
        default:
          spinner.fail(chalk.red(`Invalid type: ${type}`));
          process.exit(1);
      }

      spinner.succeed(chalk.green('Encryption successful!'));

      // Convert to hex
      const hex = Array.from(encrypted)
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');

      console.log('');
      console.log(chalk.bold('Original Value:'), chalk.cyan(value));
      console.log(chalk.bold('Type:'), chalk.cyan(type));
      console.log(chalk.bold('Encrypted (hex):'), chalk.yellow(`0x${hex}`));
      console.log(chalk.bold('Length:'), chalk.cyan(`${encrypted.length} bytes`));
      console.log('');
      console.log(chalk.dim('This encrypted value can be safely sent to your smart contract.'));

    } catch (error) {
      spinner.fail(chalk.red('Encryption failed'));
      console.error(chalk.red('\nError:'), error.message);
      process.exit(1);
    }
  });

program
  .command('info')
  .description('Display FHEVM SDK information')
  .action(() => {
    console.log('');
    console.log(chalk.bold.blue('FHEVM SDK CLI Tool'));
    console.log('');
    console.log(chalk.bold('Supported Types:'));
    console.log('  • uint64 (0 to 2^64-1)');
    console.log('  • uint32 (0 to 2^32-1)');
    console.log('  • uint16 (0 to 2^16-1)');
    console.log('  • uint8 (0 to 255)');
    console.log('  • bool (true/false)');
    console.log('');
    console.log(chalk.bold('Examples:'));
    console.log(chalk.dim('  $ fhevm encrypt 42 --contract 0x... --type uint64'));
    console.log(chalk.dim('  $ fhevm encrypt 100 --contract 0x... --type uint8'));
    console.log(chalk.dim('  $ fhevm encrypt true --contract 0x... --type bool'));
    console.log('');
  });

program.parse();
